export const MAX_INPUT = 800;

const INJECTION_PATTERNS = [
  /ignore (as|todas|previous|prior|all)\s+(instru|instruct)/i,
  /esque(c|ç)a (as )?instru/i,
  /revele? (seu |o )?prompt/i,
  /show (me )?(your |the )?(system )?prompt/i,
  /mostre? (sua |a )?(chave|api[\s_-]?key)/i,
  /reveal (your |the )?(api[\s_-]?key|secret)/i,
  /aja como (outro|another)/i,
  /act as (another|a different) (system|ai|model)/i,
  /you are now/i,
  /jailbreak|DAN mode/i,
];

export type ValidationResult =
  | { ok: true; value: string }
  | { ok: false; reason: string };

export function validateUserInput(raw: unknown): ValidationResult {
  if (typeof raw !== "string") return { ok: false, reason: "Entrada inválida." };
  const value = raw.trim();
  if (!value) return { ok: false, reason: "Por favor, escreva sua pergunta." };
  if (value.length > MAX_INPUT)
    return { ok: false, reason: `A mensagem deve ter no máximo ${MAX_INPUT} caracteres.` };
  for (const p of INJECTION_PATTERNS) {
    if (p.test(value)) {
      return {
        ok: false,
        reason:
          "Não consegui processar essa solicitação. Faça uma pergunta relacionada ao turismo no Rio de Janeiro.",
      };
    }
  }
  return { ok: true, value };
}