"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useAddCredential } from "@/hooks/useWebsites";
import { KeyRound, ShieldAlert } from "lucide-react";

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteId: string;
}

export function CredentialModal({ isOpen, onClose, websiteId }: CredentialModalProps) {
  const addCredential = useAddCredential();

  const [keyName, setKeyName] = useState("");
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName || !secret) return;

    try {
      await addCredential.mutateAsync({
        websiteId,
        data: {
          key_name: keyName,
          username: username || undefined,
          secret,
          description: description || undefined,
        },
      });

      setKeyName("");
      setUsername("");
      setSecret("");
      setDescription("");
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving credentials";
      alert(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Store Authenticated Test Credential"
      description="Inject dynamic login secrets into YAML test packs via the {{VAULT_<KEY>}} token."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Vault Key Identifier *"
          placeholder="e.g. VAULT_ADMIN_PASSWORD"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value.toUpperCase().replace(/\s+/g, "_"))}
          required
          helperText="Reference this key in YAML test pack steps as {{KEY_NAME}}."
        />

        <Input
          label="Username / Email Account (Optional)"
          placeholder="qa-tester@example.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          label="Plain Secret / Password *"
          type="password"
          placeholder="••••••••••••"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
          helperText="Secrets are immediately encrypted at rest using AES-256 GCM in the backend vault."
        />

        <Input
          label="Description / Scope"
          placeholder="Staging admin role for checkout tests"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">
            Plain secrets are never logged in test execution traces or exposed in plain HTTP responses.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={addCredential.isPending}
            leftIcon={<KeyRound className="w-4 h-4" />}
          >
            Encrypt & Save Credential
          </Button>
        </div>
      </form>
    </Modal>
  );
}
