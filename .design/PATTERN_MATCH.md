# Pattern match — CRM messages

- Product type: CRM / customer operations.
- Main object: conversation tied to a contact.
- Recipe: `crm-customer-ops`.
- Main pattern: `crm/customer-list-detail`.
- State pattern: `states/loading-empty-error-set`.
- Adaptation: conversation list replaces customer list; chat is the primary detail; customer context is secondary and collapsible.
- Deliberately removed: KPI wall and duplicate channel cards, because they do not support the primary decision of who to answer next and what to say.
