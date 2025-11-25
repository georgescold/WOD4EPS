@echo off
REM Lancement automatique de WOD4EPS
REM Ce fichier ouvre l'application dans le navigateur par défaut

echo ========================================
echo    Lancement de WOD4EPS
echo    Application de Cross Training pour EPS
echo ========================================
echo.

REM Obtenir le chemin absolu du fichier index.html
set "APP_PATH=%~dp0index.html"

echo Ouverture de l'application...
echo Chemin: %APP_PATH%
echo.

REM Ouvrir dans le navigateur par défaut
start "" "%APP_PATH%"

echo Application lancee avec succes !
echo Vous pouvez fermer cette fenetre.
echo.
pause
