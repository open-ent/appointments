#!/bin/bash

# Function to clean backend files
clean_backend() {
    echo -e '\n------------------'
    echo 'Clean before build'
    echo '------------------'
    cd backend || exit 1
    rm -rf ./.gradle
    rm -rf ./build
    rm -rf ./gradle
    rm -rf ./src/main/resources/public
    rm -rf ./src/main/resources/view
    echo 'Repo clean for build !'
    cd .. || exit 1
}

# Function to build frontend
build_frontend() {
    echo -e '\n--------------'
    echo 'Build Frontend'
    echo '--------------'
    cd frontend || exit 1
    ./build.sh installDeps build
    cd .. || exit 1
}

test_frontend() {
    echo -e '\n--------------'
    echo 'Test Frontend'
    echo '--------------'
    cd frontend || exit 1
    ./build.sh runTest
    cd .. || exit 1
}

# Function to copy frontend files to backend
copy_frontend_files() {
    echo -e '\n--------------------'
    echo 'Copy front files built'
    echo '----------------------'
    cd backend || exit 1
    cp -R ../frontend/dist/* ./src/main/resources

    # Create view directory and copy HTML files into Backend
    mkdir -p ./src/main/resources/view
    mkdir -p ./src/main/resources/public/template
    mkdir -p ./src/main/resources/public/img
    mkdir -p ./src/main/resources/public/js
    mv ./src/main/resources/*.html ./src/main/resources/view

    # Copy all public files from frontend into Backend
    cp -R ../frontend/public/* ./src/main/resources/public
    echo 'Files all copied !'
    cd .. || exit 1
}

# Function to build backend
build_backend() {
    cd backend || exit 1
    echo -e '\n-------------'
    echo 'Build Backend'
    echo '-------------'
    # cd backend || exit 1
    ./build.sh clean build
    cd .. || exit 1
}

# Function to test backend
test_backend() {
    cd backend || exit 1
    echo -e '\n-------------'
    echo 'Test Backend'
    echo '-------------'
    ./build.sh test
    cd .. || exit 1
}

# Function to clean frontend folders
clean_frontend_folders() {
    echo -e '\n-------------'
    echo 'Clean front folders'
    echo '-------------'
    rm -rf ../frontend/dist
    echo 'Folders cleaned !'
}

# Function to handle the install command
install() {
    clean_backend
    build_frontend
    copy_frontend_files
    build_backend
    clean_frontend_folders
}

# Main function to orchestrate the build process
main() {
    if [[ "$1" == "install" ]]; then
        install
    elif  [[ "$1" == "buildBack" ]]; then
        build_backend
    elif [[ "$1" == "buildFront" ]]; then
        build_frontend
    elif [[ "$1" == "clean" ]]; then
        clean_backend
    elif [[ "$1" == "testBack" ]]; then
        test_backend
    elif [[ "$1" == "testFront" ]]; then
        test_frontend
    elif [[ "$1" == "test" ]]; then
        test_frontend
        test_backend
    else
        echo "Usage: ./build.sh install"
        exit 1
    fi
}

# Call the main function with arguments
main "$@"
