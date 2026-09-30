# UI audit — Messages

Primary task: scan conversations, select one, understand channel/contact, respond, assign or create follow-up.

Problems found from the supplied screenshot:
- Two rows of summary cards consume vertical space before the work queue.
- Channel filters are duplicated.
- Three persistent columns compete for attention.
- Chat area is too narrow relative to the actual task.
- Context is always visible even when not needed.
- Density is high but hierarchy is weak.

Redesign:
- One compact toolbar for search, channel filters and unread/open state.
- Two-column list + conversation as default.
- Context becomes on-demand.
- Preserve channel color only on icons, not whole surfaces.
- Responsive: context becomes overlay; mobile prioritizes list then conversation.
