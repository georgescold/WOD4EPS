@echo off
REM Script pour pousser les modifications sur GitHub

echo ========================================
echo    Push WOD4EPS vers GitHub
echo ========================================
echo.

REM Verification de Git
echo Verification de Git...
git --version
if errorlevel 1 (
    echo.
    echo ERREUR: Git n'est pas installe ou pas dans le PATH
    echo Veuillez redemarrer votre ordinateur apres l'installation de Git
    echo.
    pause
    exit /b 1
)
echo Git detecte !
echo.

REM Configuration Git (au cas ou)
echo Configuration Git...
git config --global user.name "georgescold"
git config --global user.email "loyscqlgaming@gmail.com"
echo.

REM Ajout des fichiers
echo Ajout de tous les fichiers...
git add .
echo.

REM Commit
echo Creation du commit...
git commit -m "Ajout serveur Node.js pour deploiement Render"
echo.

REM Push vers GitHub
echo Envoi vers GitHub...
git push origin main
echo.

echo ========================================
echo    Push termine !
echo ========================================
echo.
echo Votre code est maintenant sur GitHub:
echo https://github.com/georgescold/WOD4EPS
echo.
echo Vous pouvez maintenant deployer sur Render !
echo.
pause
