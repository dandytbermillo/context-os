#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

# Log file
LOGFILE="snapshot-restore-log.txt"

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOGFILE"
}

if [ "$#" -lt 1 ]; then
  echo -e "${YELLOW}Usage:${RESET}"
  echo "  ./snapshot-and-restore.sh snapshot"
  echo "  ./snapshot-and-restore.sh restore <snapshot-branch>"
  echo "  ./snapshot-and-restore.sh restore <snapshot-branch> --files path1 path2 ..."
  exit 1
fi

ACTION=$1
shift

if [ "$ACTION" == "snapshot" ]; then
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "${RED}Error:${RESET} Not in a git repository."
    log "ERROR: Snapshot failed - not in a git repo."
    exit 1
  fi

  TIMESTAMP=$(date +%Y%m%d-%H%M%S)
  BRANCH_NAME="backup-before-llm-$TIMESTAMP"

  echo -e "${CYAN}📦 Creating snapshot branch:${RESET} $BRANCH_NAME"
  log "Starting snapshot: $BRANCH_NAME"

  git checkout -b "$BRANCH_NAME" >>"$LOGFILE" 2>&1
  git add . >>"$LOGFILE" 2>&1
  git commit -m "Snapshot before LLM edit ($TIMESTAMP)" >>"$LOGFILE" 2>&1
  git push origin "$BRANCH_NAME" >>"$LOGFILE" 2>&1
  git checkout - >>"$LOGFILE" 2>&1

  echo -e "${GREEN}✅ Snapshot complete!${RESET} Branch '${CYAN}$BRANCH_NAME${RESET}' created and pushed."
  log "Snapshot complete: $BRANCH_NAME"
  exit 0
fi

if [ "$ACTION" == "restore" ]; then
  if [ "$#" -lt 1 ]; then
    echo -e "${RED}Error:${RESET} You must specify the snapshot branch to restore from."
    log "ERROR: Restore failed - no snapshot branch specified."
    exit 1
  fi

  SNAPSHOT_BRANCH=$1
  shift

  if [ "$1" == "--files" ]; then
    shift
    echo -e "${CYAN}🔄 Restoring specific files from '${SNAPSHOT_BRANCH}':${RESET} $@"
    log "Restoring files from $SNAPSHOT_BRANCH: $*"
    git checkout "$SNAPSHOT_BRANCH" -- "$@" >>"$LOGFILE" 2>&1
    echo -e "${GREEN}✅ Specific files restored.${RESET} Review them, then commit if needed."
    log "Files restored successfully from $SNAPSHOT_BRANCH."
    exit 0
  fi

  echo -e "${YELLOW}⚠️  You are about to completely reset your current branch to snapshot '${SNAPSHOT_BRANCH}'.${RESET}"
  read -p "Are you sure? This will overwrite all uncommitted changes. Type '${GREEN}yes${RESET}' to continue: " confirm

  if [ "$confirm" != "yes" ]; then
    echo -e "${RED}❌ Aborted.${RESET}"
    log "Restore aborted by user."
    exit 1
  fi

  git reset --hard "$SNAPSHOT_BRANCH" >>"$LOGFILE" 2>&1

  echo -e "${GREEN}✅ Branch reset to snapshot '${SNAPSHOT_BRANCH}'.${RESET}"
  echo -e "${YELLOW}ℹ️  Don’t forget to push with '--force' if you want to overwrite the remote:${RESET}"
  echo -e "    git push origin $(git rev-parse --abbrev-ref HEAD) --force"
  log "Branch reset to snapshot $SNAPSHOT_BRANCH."
  exit 0
fi

echo -e "${RED}Error:${RESET} Unknown action '${ACTION}'. Use '${CYAN}snapshot${RESET}' or '${CYAN}restore${RESET}'."
log "ERROR: Unknown action $ACTION."
exit 1
