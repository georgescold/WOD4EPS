@echo off
REM Script de publication WOD4EPS sur GitHub
REM Auteur: georgescold

echo ========================================
echo    Publication WOD4EPS sur GitHub
echo ========================================
echo.

REM Configuration Git
echo [1/6] Configuration de Git...
git config --global user.name "georgescold"
git config --global user.email "loyscqlgaming@gmail.com"
echo Configuration terminee !
echo.

REM Initialisation du depot
echo [2/6] Initialisation du depot Git...
git init
echo Depot initialise !
echo.

REM Ajout des fichiers
echo [3/6] Ajout de tous les fichiers...
git add .
echo Fichiers ajoutes !
echo.

REM Premier commit
echo [4/6] Creation du commit initial...
git commit -m "Initial commit - WOD4EPS application pedagogique"
echo Commit cree !
echo.

REM Creation de la branche main
echo [5/6] Creation de la branche main...
git branch -M main
echo Branche main creee !
echo.

REM Instructions pour la suite
echo [6/6] Configuration locale terminee !
echo.
echo ========================================
echo    PROCHAINES ETAPES
echo ========================================
echo.
echo 1. Allez sur https://github.com/georgescold
echo 2. Cliquez sur "New repository" (bouton vert)
echo 3. Nommez-le: WOD4EPS
echo 4. NE cochez PAS "Initialize with README"
echo 5. Cliquez sur "Create repository"
echo.
echo 6. Ensuite, executez cette commande:
echo.
echo    git remote add origin https://github.com/georgescold/WOD4EPS.git
echo    git push -u origin main
echo.
echo ========================================
echo.
pause
