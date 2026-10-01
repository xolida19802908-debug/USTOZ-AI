export interface GenerateResponse<T> {
  success: boolean;
  data: T;
  source?: string;
  error?: string;
}

export async function callAIGenerator<T = any>(
  action: 'lesson' | 'test' | 'questions' | 'homework' | 'explain' | 'rubric' | 'interactive',
  payload: Record<string, any>
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server xatoligi: ${response.status}`);
    }

    const result: GenerateResponse<T> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Material yaratishda xatolik yuz berdi.");
    }

    return result.data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Server javob berish vaqti tugadi. Iltimos, qayta urinib ko'ring.");
    }
    console.error("AI service call failed:", error);
    throw new Error(
      error.message?.includes("Server xatoligi")
        ? "AI xizmatida vaqtinchalik xatolik yuz berdi. Iltimos, qayta urinib ko‘ring."
        : error.message || "AI xizmatida vaqtinchalik xatolik yuz berdi. Iltimos, qayta urinib ko‘ring."
    );
  }
}
