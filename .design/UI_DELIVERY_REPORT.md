# UI delivery report — CRM Messages

## What changed
- Removed KPI wall and duplicate channel cards.
- Replaced them with one compact search/filter/status toolbar.
- Default layout is conversation list + chat.
- Customer context is now on-demand instead of permanently occupying width.
- Increased chat width and message composer clarity.
- Preserved channel identity through icons rather than large colored surfaces.
- Added responsive context overlay and mobile-safe controls.

## Recipe and patterns
- Recipe: CRM Customer Ops.
- Pattern: crm/customer-list-detail.
- State pattern: loading-empty-error-set.

## QA
- Desktop: no horizontal scroll, no small controls, no blocking fixed overlay.
- Mobile: no horizontal scroll, no small controls, no blocking fixed overlay.
- Visual score: 4.49/5.

## Remaining risks
- Sending a reply is an external action and should remain explicitly user-triggered.
- Assignment and CRM writeback mutate customer data and should preserve operator intent/auditability.
