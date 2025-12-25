#!/bin/sh
# Wrapper script to run npm commands in Docker with proper argument handling

npm_cmd="$1"
shift

# Check if we need to insert -- separator for npm
# If we have a script name followed by flags (--name, --email, etc), insert -- before flags
# This handles cases where Make consumes the -- target
needs_separator=false
if [ $# -ge 2 ]; then
	# Check if second argument (first after script name) starts with --
	script_name="$1"
	first_flag="$2"
	if [ "$(echo "$first_flag" | cut -c1-2)" = "--" ] && [ "$first_flag" != "--" ]; then
		needs_separator=true
	fi
fi

if [ "$needs_separator" = "true" ]; then
	# Insert -- separator between script name and flags
	script_name="$1"
	shift
	set -- "$script_name" "--" "$@"
fi

# Build the command with all remaining arguments
# All arguments after npm_cmd are passed through as-is to npm
# Use -T to disable TTY allocation for scripts (remove if you need interactive mode)
docker compose exec -T web npm "$npm_cmd" "$@"

