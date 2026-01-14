
import { GoogleGenAI } from "@google/genai";
import { Verse, Chapter } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getVerseInsights = async (verse: Verse, chapter: Chapter): Promise<string> => {
  const prompt = `Provide a deep spiritual insight and historical context for Surah ${chapter.name_complex}, Verse ${verse.verse_number}. 
  The Arabic text is: "${verse.text_uthmani}". 
  The translation is: "${verse.translations?.[0]?.text}". 
  Please explain its relevance and provide a short reflection. Format the output nicely in Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI insight service is currently unavailable.";
  }
};

export const getSurahTheme = async (chapter: Chapter): Promise<string> => {
  const prompt = `Provide a comprehensive summary of the main themes and the spiritual importance of Surah ${chapter.name_complex} (${chapter.name_arabic}). 
  Include:
  1. Main Themes
  2. Spiritual Importance
  3. Context of Revelation (briefly)
  
  Format the response in clear Markdown with headers. Keep it concise yet deeply informative.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Unable to fetch Surah information.";
  } catch (error) {
    console.error("Gemini Theme Error:", error);
    return "Surah information is currently unavailable.";
  }
};

export const getTopicInfo = async (topic: string): Promise<string> => {
  let instruction = "";
  
  if (topic.toLowerCase().includes("hadith")) {
    instruction = "Provide a selection of 3 authentic and beautiful Hadiths related to the topic. Include the Arabic text, English translation, and the source (e.g., Bukhari, Muslim). Provide a brief lesson for each.";
  } else if (topic.toLowerCase().includes("seerah") || topic.toLowerCase().includes("prophet")) {
    instruction = "Provide a beautiful chronological or thematic overview of this aspect of the life of Prophet Muhammad (PBUH). Focus on lessons of character, mercy, and wisdom. Use Markdown with subheadings.";
  } else if (topic.toLowerCase().includes("dua") || topic.toLowerCase().includes("supplication")) {
    instruction = "Provide 3 powerful and authentic Duas (supplications) from the Quran or Sunnah for this situation. Include the Arabic text, transliteration, and English translation. Explain the benefit of reciting each.";
  } else {
    instruction = "Explain this Islamic topic in a beautiful, educational, and spiritual way. Use authentic sources and provide relevant Quranic verses if applicable.";
  }

  const prompt = `Topic: "${topic}"\n\nInstruction: ${instruction}\n\nFormat the response with clean Markdown for a mobile-responsive web app. Ensure the tone is respectful and inspiring.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Unable to fetch information.";
  } catch (error) {
    console.error("Gemini Topic Error:", error);
    return "This information is currently unavailable. Please try again later.";
  }
};
