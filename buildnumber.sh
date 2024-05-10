#!/bin/bash

envFile=".env"
varToReplace="APP_VERSION"

if [ ! -f ".buildnumber" ]; then
  echo ".buildnumber not found ";
  exit;
fi

buildnumber=$(cat .buildnumber);
buildnumber=${buildnumber//[\.\_]}

if grep -q "${varToReplace}" "$envFile"; then
  sed -i '' "s/${varToReplace}=.*/${varToReplace}=${buildnumber}/" $envFile
else
  echo "" >> $envFile
  echo "${varToReplace}=${buildnumber}" >> $envFile
fi

rm .buildnumber
