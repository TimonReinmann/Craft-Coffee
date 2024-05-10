#!/bin/bash

varValue="true"
envFile=".env"
varToReplace="CRAFT_SYSTEM_ONLINE"

# Funktion, um das Betriebssystem zu überprüfen
check_os() {
    case "$(uname -s)" in
        Linux*)     os="Linux";;
        Darwin*)    os="macOS";;
        *)          os="Unknown";;
    esac
}

# Befehl zum Bearbeiten der Datei entsprechend dem Betriebssystem
edit_file() {
    if [ "$os" == "macOS" ]; then
        sed -i '' "s/${varToReplace}=.*/${varToReplace}=${varValue}/" "$envFile"
    else
        sed -i "s/${varToReplace}=.*/${varToReplace}=${varValue}/" "$envFile"
    fi
}

check_os

if grep -q "${varToReplace}" "$envFile"; then
    edit_file
else
    echo "" >> "$envFile"
    echo "${varToReplace}=${varValue}" >> "$envFile"
fi
