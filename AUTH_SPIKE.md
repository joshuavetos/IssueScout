# GitHub App vs OAuth App — deployment spike

The architecture intentionally leaves this unresolved until measured on the real deployed URL.

## OAuth App path (implemented)

Test:
- iPhone browser authorization friction.
- No-scope public repository reads required by Stage 1.
- Revocation behavior.
- Token persistence/encryption.
- `/user` identity and public repository health call.

## GitHub App path (next comparison, not yet implemented)

Do not add it merely because GitHub generally recommends GitHub Apps. Register a minimal GitHub App only after the OAuth path is deployed. Compare the same criteria:
- user sign-in/install friction on iPhone;
- exact read permissions needed for arbitrary public repositories;
- short-lived token handling;
- whether installation/repository selection creates needless friction for this one-user public-only product.

## Decision rule

Keep OAuth if it provides every required public-data endpoint with simpler iPhone flow and acceptably narrow permissions. Choose GitHub App only if the measured permission/token benefit materially outweighs the installation/authorization complexity.

This is an implementation-dependent unknown. It is not allowed to silently disappear from the project.
