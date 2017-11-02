#github-utils

Nodejs based Wrapper on top of git utilities

# Configuration
`
    1. setup .gitutils-rc file based on the sample configurations in your HOME directory

    2. The directory mention in the property /projects_1/github or c:\\projects_1\\github,  needs to be created

    3. We are using github's APIs to fetch your repos and orgnizations, so it will need your GITHUB_TOKEN to be configured in the properties file
       You can generate personal token at this path https://github.com/settings/tokens
`

# Help:

github-utils Help (C) Mahesh Kulkarni 2017

**** Usage: ****
--help                                   Print this help
--clone-all                              Search for your userid and clone all personal services and services from orgs where you contribute
--show-all                               Show all services cloned previously
--show-details {repo-name}               Show details for repository
--clone {repo-url}                       Clone a new repository and add on utility
--pull-latest {repo-name}                Pull latest for repository from remote

**** Configurations: ****
You need to create configuration file in your Home directory with name '.gitutils-rc'

** Sample .gitutils-rc **

USER_NAME=<Your GITHUB  USERNAME>
GITHUB_TOKEN=<YOUR GITHUB TOKEN>
GIT_API_BASE_PATH=https://api.github.com
GIT_BASE_PATH=https://github.com
LOCAL_REPO_BASE_PATH=/projects_1/github
EXCLUDE_REPOS=

You can use hash(#) for commenting lines in your config file
Also Note that, application can not work without .gitutils-rc file
