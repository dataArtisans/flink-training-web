#!/usr/bin/env bash

# This script builds the page and copies it to the `gh-pages` branch, which can
# be previewed at http://dataartisans.github.io/flink-training.

echo "Building page."
jekyll b --

this_branch=`git rev-parse --abbrev-ref HEAD`
echo "We are currently in branch '$this_branch'."

if [ $this_branch == "gh-pages" ]; then
	echo "You cannot run this script in the 'gh-pages' branch."
	exit 1
fi

git rev-parse --verify gh-pages > /dev/null 2> /dev/null

if [ $? -eq 0 ]; then
	echo "\nDeleting branch 'gh-pages'."
	git branch -D gh-pages
fi

echo -e "\nChecking out new 'gh-pages' branch with current state."
git checkout -b gh-pages
