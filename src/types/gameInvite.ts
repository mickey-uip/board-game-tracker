export interface GameInvite {
  id: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  toName: string;
  status: 'pending' | 'accepted' | 'declined' | 'removed' | 'cancelled' | 'completed';
  createdAt: string;
  /** completed 時のみ使用 */
  gameName?: string;
  gameImage?: string;
  rank?: number;
  totalPlayers?: number;
}
