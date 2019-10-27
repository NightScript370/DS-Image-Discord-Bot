#!/bin/zsh

loop() {
    for file in $1/*; do
        if [[ -d $file ]]; then
            echo -e "\e[0;93m$file\e[0m is a \e[0;94mdirectory\e[0m, looping over it..."
            loop "$file"
        else
            filename="${file##*/}"
            extension="${filename##*.}"
            if [[ $extension == "js" ]]; then
                echo -e "\e[0;93m$file\e[0m is a \e[0;1m.$extension\e[0m file, linting it..."
                jslint $file
            else
                echo -e "\e[0;93m$file\e[0m is \e[0;91mnot\e[0m a html/rss/js file, skipping it..."
            fi
        fi
    done
}

loop .
