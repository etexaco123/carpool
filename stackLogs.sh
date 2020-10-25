#!/bin/bash
# exit logs with ctrl-c
stack=$1
if [ -z "${stack}" ]; then
    echo 'Usage:'
    echo "$0 <stack>"
    exit 1
fi

stackServices=$(docker stack services "$stack" --format "{{.ID}}")

trap 'jobs=$(jobs -p) && test -n "$jobs" && kill $jobs' EXIT

for item in ${stackServices//\\n/$'\n'}; do
    docker service logs -f -t --tail 10 "$item" &
done

sleep infinity