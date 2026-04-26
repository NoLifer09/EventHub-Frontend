import { useState } from "react";
import { Calendar, MapPin, Share2, Link2Off, Link2, ChevronDown, Trash2, Copy, MessageCircle } from "lucide-react";
import MoreActionsMenu from "./MoreActionsMenu";

const STATUS_BADGE = {
  PUBLISHED:  { label: "LIVE",      style: "bg-MainGreenBackground text-MainGreen border-MainGreenLine" },
  DRAFT:      { label: "DRAFT",     style: "bg-MainBlueBackground text-MainBlue border-MainBlueLine" },
  COMPLETED:  { label: "PAST",      style: "bg-LineBox text-MainOffWhiteText border-LineBox" },
  CANCELLED:  { label: "CANCELLED", style: "bg-OffRedbackground text-MainRed border-OffRedbackground" },
};

const INVITE_BASE = `${window.location.origin}/event/`;

const EventHeader = ({ event, revoking, restoring, settingStatus, onEdit, onRevokeInvite, onRestoreInvite, onSetStatus, onDeleteClick }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const statusInfo = STATUS_BADGE[event.status] ?? STATUS_BADGE.DRAFT;
  const isLive = event.status === "PUBLISHED";
  const isTerminal = event.status === "COMPLETED" || event.status === "CANCELLED";

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  const inviteUrl = event.inviteCode ? `${INVITE_BASE}${event.inviteCode}` : null;

  const handleCopyLink = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopyToast(true);
    setShowShareMenu(false);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!inviteUrl) return;
    const msg = encodeURIComponent(`You're invited to ${event.title}! RSVP here: ${inviteUrl}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    setShowShareMenu(false);
  };

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-2xl overflow-hidden mb-6">
      {event.coverImage && (
        <div className="h-40 w-full relative">
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-NavigationBackground/90 to-transparent" />
        </div>
      )}

      <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: meta */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border ${statusInfo.style}`}>
              {statusInfo.label}
            </span>
            {isLive && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-SecondOffWhiteText">
                Upcoming Event
              </span>
            )}
          </div>

          <h1 className="text-white font-jakarta font-bold text-2xl mb-2">{event.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-MainOffWhiteText text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-MainBlue shrink-0" />
              <span>{formattedDate} · {formattedTime}</span>
            </div>
            {event.location?.address && (
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-MainBlue shrink-0" />
                <span>{event.location.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Share — always visible when inviteCode exists */}
          {inviteUrl && (
            <div className="relative">
              <button
                onClick={() => setShowShareMenu((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 bg-MainBlue hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <Share2 size={13} />
                {copyToast ? "Copied!" : "Share Invite"}
              </button>
              {showShareMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                  <div className="absolute right-0 top-full mt-1.5 z-20 bg-NavigationBackground border border-LineBox rounded-xl shadow-xl overflow-hidden w-48">
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-MainOffWhiteText hover:bg-MainBackground hover:text-white transition-colors"
                    >
                      <Copy size={13} /> Copy Link
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-MainOffWhiteText hover:bg-MainBackground hover:text-white transition-colors"
                    >
                      <MessageCircle size={13} /> Share via WhatsApp
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Revoke / Restore — separate from share */}
          {!isTerminal && inviteUrl && (
            event.inviteLinkActive ? (
              <button
                onClick={onRevokeInvite}
                disabled={revoking}
                className="flex items-center gap-2 px-4 py-2 bg-MainYellowBackground border border-MainYellowLine hover:opacity-80 text-MainYellow rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
              >
                <Link2Off size={13} />
                {revoking ? "Revoking..." : "Revoke Link"}
              </button>
            ) : (
              <button
                onClick={onRestoreInvite}
                disabled={restoring}
                className="flex items-center gap-2 px-4 py-2 bg-MainGreenBackground border border-MainGreenLine hover:opacity-80 text-MainGreen rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
              >
                <Link2 size={13} />
                {restoring ? "Restoring..." : "Restore Link"}
              </button>
            )
          )}

          {!isTerminal && (
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 bg-MainBackground border border-LineBox hover:border-MainBlue/50 text-SecondOffWhiteText hover:text-white rounded-lg text-sm transition-colors"
              >
                More <ChevronDown size={13} />
              </button>
              {showMoreMenu && (
                <MoreActionsMenu
                  isLive={isLive}
                  settingStatus={settingStatus}
                  onMarkCompleted={() => onSetStatus("COMPLETED")}
                  onCancelEvent={() => onSetStatus("CANCELLED")}
                  onDelete={onDeleteClick}
                  onClose={() => setShowMoreMenu(false)}
                />
              )}
            </div>
          )}

          {isTerminal && (
            <button
              onClick={onDeleteClick}
              className="flex items-center gap-2 px-3 py-2 bg-MainBackground border border-LineBox hover:border-MainRed/50 text-SecondOffWhiteText hover:text-MainRed rounded-lg text-sm transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
