/**
 * Session Data Store - Temporary holding area for all generator inputs
 * Data accumulates here and only sends to backend when "TAP TO CREATE" is clicked
 */

export type GeneratorType = 'freestyle';

export interface SessionData {
  // Generator type
  generatorType?: GeneratorType;
  
  // Source Card (Q1 & Q2) - shared across all generators
  sourceCard?: {
    questionOne?: string;
    questionTwo?: string;
    images?: string[]; // Base64 encoded
  };
  
  // Freestyle specific
  freestyle?: {
    prompt?: string;
    images?: string[]; // Base64 encoded
  };
  
  // Shared options across all generators
  options?: {
    mood?: string;
    style?: string;
    placement?: string;
    size?: string;
    color?: string;
  };
  
  // Metadata
  userId?: string;
  sessionId: string;
  timestamp: number;
}

class SessionDataStore {
  private currentSession: SessionData | null = null;
  private readonly ENDPOINT = '/api/generate';

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize or get current session
   */
  private getSession(userId?: string): SessionData {
    if (!this.currentSession) {
      this.currentSession = {
        sessionId: this.generateSessionId(),
        timestamp: Date.now(),
        userId,
      };
    }
    return this.currentSession;
  }

  /**
   * Set generator type
   */
  setGeneratorType(type: GeneratorType, userId?: string): void {
    const session = this.getSession(userId);
    session.generatorType = type;
    console.log(`🎨 Generator type set: ${type}`);
  }

  /**
   * Store Source Card data (Q1 & Q2 + optional images)
   */
  setSourceCardData(data: { questionOne?: string; questionTwo?: string; images?: string[] }, userId?: string): void {
    const session = this.getSession(userId);
    session.sourceCard = { ...session.sourceCard, ...data };
    console.log('📝 Source card data stored in session');
  }

  /**
   * Store Freestyle data
   */
  setFreestyleData(data: { prompt?: string; images?: string[] }, userId?: string): void {
    const session = this.getSession(userId);
    session.freestyle = { ...session.freestyle, ...data };
    console.log('🎨 Freestyle data stored in session');
  }

  /**
   * Store shared options (mood, style, placement, size, color)
   */
  setOptions(options: Partial<SessionData['options']>, userId?: string): void {
    const session = this.getSession(userId);
    session.options = { ...session.options, ...options };
    console.log('⚙️ Options stored in session', options);
  }

  /**
   * Get current session data (for preview/debugging)
   */
  getCurrentSession(): SessionData | null {
    return this.currentSession;
  }

  /**
   * Send ALL accumulated data to backend (called when "TAP TO CREATE" is clicked)
   */
  async submitToBackend(): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No session data to submit');
    }

    try {
      console.log('🚀 Sending all session data to backend...', this.currentSession);

      const response = await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.currentSession),
      });

      if (!response.ok) {
        throw new Error(`Backend submission failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Session data successfully sent to backend', result);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to send session data to backend:', error);
      // Store in localStorage as backup if backend fails
      this.storeInLocalBackup();
      throw error;
    }
  }

  /**
   * Backup storage if backend fails
   */
  private storeInLocalBackup(): void {
    if (!this.currentSession) return;
    
    try {
      const backupKey = `tattty_backup_${this.currentSession.sessionId}`;
      localStorage.setItem(backupKey, JSON.stringify(this.currentSession));
      console.log('📦 Session data stored in local backup');
    } catch (error) {
      console.error('Failed to store backup:', error);
    }
  }

  /**
   * Clear current session (called after successful generation or session end)
   */
  clearSession(): void {
    this.currentSession = null;
    console.log('🧹 Session cleared');
  }

  /**
   * Check if session has data
   */
  hasData(): boolean {
    return this.currentSession !== null;
  }
}

// Export singleton instance
export const sessionDataStore = new SessionDataStore();
