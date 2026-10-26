"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Input, Select } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useCreateWebsite } from "@/hooks/useWebsites";
import { TargetEnvironment } from "@/types/api";

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddWebsiteModal({ isOpen, onClose }: AddWebsiteModalProps) {
  const createWebsite = useCreateWebsite();

  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [environment, setEnvironment] = useState<TargetEnvironment>("staging");
  const [allowedDomains, setAllowedDomains] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !baseUrl) return;

    try {
      const domains = allowedDomains
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      await createWebsite.mutateAsync({
        name,
        base_url: baseUrl,
        environment,
        allowed_domains: domains,
      });

      setName("");
      setBaseUrl("");
      setAllowedDomains("");
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error creating website";
      alert(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Target Website"
      description="Define the root URL, environment tier, and domain boundary guardrails for automated scanning."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Display Name *"
          placeholder="e.g. Apex Storefront (Production)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Base Target URL *"
          placeholder="https://shop.apexstore.io"
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          required
          helperText="Include protocol (https://). Crawlers and security probes will anchor here."
        />

        <Select
          label="Environment Tier"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value as TargetEnvironment)}
          options={[
            { label: "Production", value: "production" },
            { label: "Staging", value: "staging" },
            { label: "Test / QA", value: "test" },
            { label: "Local / Development", value: "local" },
          ]}
        />

        <Input
          label="Allowed Domains Boundary (Comma-separated)"
          placeholder="shop.apexstore.io, cdn.apexstore.io"
          value={allowedDomains}
          onChange={(e) => setAllowedDomains(e.target.value)}
          helperText="Playwright navigation is strictly bounded to these domains to prevent external link leakage."
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={createWebsite.isPending}>
            Register Target
          </Button>
        </div>
      </form>
    </Modal>
  );
}
