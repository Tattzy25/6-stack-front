declare module '../personas/askTaTTTyPersonas.js' {
  export function getAskTaTTTyPersona(action: string): any;
}

declare module '../personas/brainstormPersonas.js' {
  export function getBrainstormPersona(personaId: string): any;
  export function isValidBrainstormPersona(personaId: string): boolean;
}

declare module '../personas/chatPersonas.js' {
  export function getChatPersona(personaId: string): any;
  export function isValidChatPersona(personaId: string): boolean;
}
