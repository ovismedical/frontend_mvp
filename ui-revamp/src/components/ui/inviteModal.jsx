import React from "react";
import { QRCodeSVG } from "qrcode.react";
import Button from "../ui/button";
import "../../styles/components/inviteModal.css";

const InviteModal = ({ isOpen, onClose, userName, inviteLink }) => {
  if (!isOpen) return null; 

  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = inviteLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          console.log("Copy failed");
        }
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="invite-modal-overlay">
      <div className="invite-modal">
        {/* Header */}
        <div className="invite-modal-header">
          <h3 className="invite-modal-title h4">My QR Code</h3>
          <span
            className="material-symbols-rounded close-icon"
            onClick={onClose}
          >
            close
          </span>
        </div>

        {/* QR Code */}
        <div className="invite-modal-body">
          <QRCodeSVG
            value={inviteLink}
            size={180}
            bgColor="#ffffff"
            fgColor="#000000"
          />
          <p className="invite-modal-text body">
            Scan this QR code to send request to <b>{userName}</b>
          </p>
        </div>

        {/* Footer with Share Button */}
        <div className="invite-modal-footer">
          <Button
            variant="filled"
            onClick={handleCopy}
            className="invite-share-btn body"
          >
            {copied ? " Invite Link Copied" : "Copy Invite Link"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
