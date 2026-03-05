export interface GameInvite {
  id: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  toName: string;
  status: 'pending' | 'accepted' | 'declined' | 'removed' | 'cancelled';
  createdAt: string;
}
