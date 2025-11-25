@echo off
REM Script pour pousser le code sur GitHub (a executer APRES avoir cree le repository)

echo ========================================
echo    Push vers GitHub
echo ========================================
echo.

echo Liaison avec le repository GitHub...
git remote add origin https://github.com/georgescold/WOD4EPS.git

echo.
echo Envoi du code vers GitHub...
git push -u origin main

echo.
echo ========================================
echo    Publication terminee !
echo ========================================
echo.
echo Votre projet est maintenant sur GitHub:
echo https://github.com/georgescold/WOD4EPS
echo.
pause
