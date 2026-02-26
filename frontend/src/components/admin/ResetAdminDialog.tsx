import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ResetAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isResetting?: boolean;
}

export default function ResetAdminDialog({
  open,
  onOpenChange,
  onConfirm,
  isResetting = false,
}: ResetAdminDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        style={{
          backgroundColor: '#0F0F0F',
          border: '1px solid rgba(209,0,0,0.3)',
          color: '#ffffff',
        }}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'rgba(209,0,0,0.1)',
                border: '1px solid rgba(209,0,0,0.4)',
                clipPath:
                  'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
              }}
            >
              <ShieldAlert size={20} style={{ color: '#D10000' }} />
            </div>
            <AlertDialogTitle
              style={{
                color: '#ffffff',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Reset Admin Access
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription
            style={{ color: 'rgba(201,201,201,0.7)', fontSize: '0.875rem', lineHeight: '1.6' }}
          >
            This will <span style={{ color: '#ff6b6b', fontWeight: 600 }}>revoke all current admin access</span> and
            allow you to re-claim admin privileges with your current identity.
            <br /><br />
            Any existing admin sessions will be immediately invalidated. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 mt-2">
          <AlertDialogCancel
            disabled={isResetting}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#C9C9C9',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isResetting}
            style={{
              backgroundColor: isResetting ? 'rgba(209,0,0,0.4)' : '#D10000',
              border: '1px solid #D10000',
              color: '#ffffff',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              clipPath:
                'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              cursor: isResetting ? 'not-allowed' : 'pointer',
            }}
          >
            {isResetting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={13} className="animate-spin" />
                Resetting...
              </span>
            ) : (
              'Confirm Reset'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
