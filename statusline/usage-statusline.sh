#!/usr/bin/env bash
# Status line: shows weekly and five hour usage, and saves them for the usage guard.
# Claude Code passes rate_limits only to the status line (Pro, Max and Ultra plans), so this is
# the one place a hook can learn the weekly figure from.
set -uo pipefail
input=$(cat)
state="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/state"
mkdir -p "$state" 2>/dev/null
printf '%s' "$input" | node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
  let j={};try{j=JSON.parse(s)}catch(e){}
  const r=j.rate_limits||{};const w=r.seven_day||{};const f=r.five_hour||{};
  if(typeof w.used_percentage==="number"){
    require("fs").writeFileSync(process.argv[1],JSON.stringify({weekly:w.used_percentage,resets_at:w.resets_at||0,saved_at:Math.floor(Date.now()/1000)}));
  }
  const parts=[];
  if(typeof w.used_percentage==="number")parts.push("week "+Math.round(w.used_percentage)+"%");
  if(typeof f.used_percentage==="number")parts.push("5h "+Math.round(f.used_percentage)+"%");
  process.stdout.write(parts.join("  ")||"usage n/a");
});' "$state/usage.json"
