import { GoogleGenAI, Schema, Type } from "@google/genai";
import { StudyMaterial } from "../types";

const processFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove Data-URL declaration (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateStudyMaterial = async (
  files: File[],
  rawText: string,
  focus: string,
  omit: string
): Promise<StudyMaterial> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  // 1. Prepare file parts
  const fileParts = await Promise.all(
    files.map(async (file) => ({
      inlineData: {
        mimeType: file.type,
        data: await processFileToBase64(file),
      },
    }))
  );

  // 2. Define Schema
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING, description: "A thorough, deep summary of the topic covering ALL files. Use markdown for formatting." },
            learningQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "content", "learningQuestions"],
        },
      },
      flashcards: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING },
          },
          required: ["front", "back"],
        },
      },
      quiz: {
        type: Type.ARRAY,
        description: "List of chapters for the quiz. Each chapter corresponds to a summary topic.",
        items: {
          type: Type.OBJECT,
          properties: {
            topicName: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              description: "Exactly 4 questions per chapter.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly 4 options.",
                  },
                  correctAnswerIndex: { type: Type.INTEGER, description: "0-based index of correct option" },
                  explanation: { type: Type.STRING, description: "Why is the answer correct/wrong?" },
                  hint: { type: Type.STRING, description: "A helpful hint without giving the answer away." },
                },
                required: ["question", "options", "correctAnswerIndex", "explanation", "hint"],
              },
            },
          },
          required: ["topicName", "questions"],
        },
      },
    },
    required: ["summary", "flashcards", "quiz"],
  };

  // 3. Construct Prompt
  let promptText = `
    Du bist ein erfahrener KI-Tutor. Deine Aufgabe ist es, umfassende Lernmaterialien aus ALLEN bereitgestellten Dokumenten und Texten zu erstellen.
    
    Sprache: Deutsch (German).

    WICHTIG:
    - Es müssen ALLE hochgeladenen Dateien und Texte berücksichtigt werden.
    - Die Zusammenfassung muss detailliert und strukturiert sein, sodass keine externen Quellen mehr nötig sind.
    
    Anweisungen:
    1. Analysiere den kompletten Inhalt tiefgründig.
    2. Zusammenfassung: Strukturiere den Inhalt logisch nach Themen/Kapiteln. Füge am Ende jedes Themas 3-5 Lernfragen hinzu.
    3. Flashcards: Erstelle Karteikarten für Schlüsselbegriffe.
    4. Quiz: Erstelle ein Quiz passend zu den Kapiteln. Jedes Kapitel MUSS genau 4 Fragen haben.
    
    Kontext & Filter:
  `;

  if (focus) promptText += `\n- LERNFOKUS (Hierauf besonders eingehen): ${focus}`;
  if (omit) promptText += `\n- WEGLASSEN (Diesen Inhalt ignorieren): ${omit}`;
  if (rawText) promptText += `\n- ZUSÄTZLICHER TEXT: ${rawText}`;

  // 4. Call API
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      role: "user",
      parts: [...fileParts, { text: promptText }],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.3,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Keine Antwort von der KI erhalten.");

  try {
    return JSON.parse(text) as StudyMaterial;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Fehler bei der Verarbeitung der KI-Antwort.");
  }
};