/**
 * OpenAI gpt-4o-mini 集成
 * 
 * 超輕量的 GPT-4 版本，專為成本效益的二進制分類而優化。
 * 用於檢測詐騙、非法交易、平台濫用等。
 * 
 * 系統提示強制執行嚴格的輸出約束：
 * 只返回單個布爾字符 '1' (危險) 或 '0' (安全)
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = 'gpt-4o-mini';

export type SecurityCheckType = 'message' | 'listing' | 'general';

/**
 * OpenAI 安全檢查結果
 */
export interface SecurityCheckResult {
  isRisky: boolean;
  model: string;
  checkType: SecurityCheckType;
  processingTimeMs: number;
}

/**
 * 使用 OpenAI gpt-4o-mini 檢查輸入內容
 * 
 * 詐騙檢測提示：
 * - 私下匯款要求
 * - 線下交易強制
 * - 虛假身份驗證
 * - 投資/ 理財詐騙
 * - 強迫性銷售
 */
export async function checkContentWithOpenAI(
  content: string,
  checkType: SecurityCheckType = 'general'
): Promise<SecurityCheckResult> {
  if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    return {
      isRisky: false,
      model: OPENAI_MODEL,
      checkType,
      processingTimeMs: 0,
    };
  }

  const startTime = Date.now();

  const systemPrompt = `You are a backend security filter for an e-commerce platform. Analyze the input for scam, off-platform coercion, illegal activity, or platform abuse. 
You must ONLY output a single boolean character: '1' for risky/unsafe content, or '0' for safe content. 
Never include any explanation, reasoning, or additional text. 
Output only '1' or '0'.

Specifically look for:
- Requests for private bank transfers or off-platform payment
- Pressure to conduct transactions outside the platform
- Fake identity verification schemes
- Investment/financial scams
- Coercive or aggressive sales tactics
- Links to external payment platforms or apps
- Requests to verify identity through unusual means`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: content.substring(0, 2000), // 限制長度以控制成本
          },
        ],
        temperature: 0.3, // 低溫度確保一致的二進制輸出
        max_tokens: 1,
        top_p: 0.1,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API returned ${response.status}: ${error}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const output = data.choices[0]?.message.content?.trim() || '0';
    const isRisky = output === '1';

    return {
      isRisky,
      model: OPENAI_MODEL,
      checkType,
      processingTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Error checking content with OpenAI:', error);
    // 失敗時默認安全（不中斷用戶體驗），但應記錄供人工審查
    return {
      isRisky: false,
      model: OPENAI_MODEL,
      checkType,
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * 批量檢查多條內容（節省成本的批量操作）
 */
export async function checkMultipleContents(
  contents: string[],
  checkType: SecurityCheckType = 'general'
): Promise<SecurityCheckResult[]> {
  return Promise.all(
    contents.map((content) => checkContentWithOpenAI(content, checkType))
  );
}

/**
 * 異步隊列化檢查（防止 API 限制）
 */
const checkQueue: Array<{
  content: string;
  type: SecurityCheckType;
  resolve: (result: SecurityCheckResult) => void;
  reject: (error: Error) => void;
}> = [];

let isProcessing = false;

async function processQueue() {
  if (isProcessing || checkQueue.length === 0) return;

  isProcessing = true;
  const { content, type, resolve, reject } = checkQueue.shift()!;

  try {
    const result = await checkContentWithOpenAI(content, type);
    resolve(result);
  } catch (error) {
    reject(error instanceof Error ? error : new Error(String(error)));
  }

  // 防止 API 限制，插入延遲
  await new Promise((r) => setTimeout(r, 100));
  isProcessing = false;
  processQueue();
}

/**
 * 隊列化檢查（推薦用於需要等待結果的情況）
 */
export function queuedSecurityCheck(
  content: string,
  checkType: SecurityCheckType = 'general'
): Promise<SecurityCheckResult> {
  return new Promise((resolve, reject) => {
    checkQueue.push({ content, type: checkType, resolve, reject });
    processQueue();
  });
}
