# cicdp-p1
- Practical 1
- Setup Git
    1. SSH Key Setup
        - $ ssh-keygen -t ed25519 -C "YOUR EMAIL ADDRESS"
        - Copy the public Key
        - Add new SSH key in GitHub Setting
        - connect to GitHub ssh -T git@github.com
        - Receive a Welcome message
    2. Git Global Setup
        - $ git config --global user.name "USERNAME"
        - $ git config --global user.email "email_address@example.com"
        - git config --global --list
    3. Initialise Connection
        - git init
        - git add remote
        - checkout to newly added main branch
        - make changes, add commit and sync
        - extra contents...
