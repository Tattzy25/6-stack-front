/**
 * TaTTTy Personas - Centralized Export
 * 
 * NO HARDCODING: All personas are configurable
 * Provider and model settings are in .env
 */

// Chat Personas (for chat interface)
export {
  CHAT_PERSONAS,
  getChatPersona,
  getAllChatPersonas,
  isValidChatPersona,
  getChatPersonaIds,
  type ChatPersona
} from './chatPersonas';

// AskTaTTTy Personas (for Optimize/Ideas buttons)
export {
  ASK_TATTTY_PERSONAS,
  getAskTaTTTyPersona,
  getAllAskTaTTTyPersonas,
  isValidAskTaTTTyAction,
  getAskTaTTTyActions,
  type AskTaTTTyPersona
} from './askTaTTTyPersonas';

// Brainstorm Personas (for brainstorm generator)
export {
  BRAINSTORM_PERSONAS,
  getBrainstormPersona,
  getAllBrainstormPersonas,
  isValidBrainstormPersona,
  getBrainstormPersonaIds,
  getPersonasByStyle,
  type BrainstormPersona
} from './brainstormPersonas';
