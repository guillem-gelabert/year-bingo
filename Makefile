.PHONY: npm-% --

# Run npm commands in Docker
# Usage: make npm-run dev
#        make npm-run generate-login-link -- --name "John Doe"
#        make npm-install
# Note: Quotes around arguments may be stripped by shell. For complex cases, use:
#       make npm-run generate-login-link ARGS="-- --name 'John Doe'"
npm-%:
	@args=""; \
	for goal in $(filter-out npm-%,$(MAKECMDGOALS)); do \
		args="$$args $$goal"; \
	done; \
	if [ -n "$$ARGS" ]; then \
		args="$$args $$ARGS"; \
	fi; \
	./scripts/npm-docker.sh $(subst npm-,,$@) $$args

# Allow -- as a target (npm argument separator) - must be defined before catch-all
--:
	@:

# Catch-all to prevent Make from trying to build targets passed as arguments
%:
	@:                                    