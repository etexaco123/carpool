@echo off

set stack=%1

:Getops
if [%1] == [] goto Help

goto Continue
 
:Help
 echo:
 echo: Usage: stockLogs.bat ^<STACK NAME^>
 echo:
 exit 1
 
::::::::::::::::::::::::::::::::::::::::::::::::::::::;

:Continue

:: The solution was adapted to fit both simple docker-compose and Docker Stack with Swarm
for /F "tokens=*" %%i in ('docker stack services %stack% --format "{{.ID}}"') do (
  start /b docker service logs -f -t --tail 10 %%i
)

::sleep infinity