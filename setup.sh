  ```bash
   #!/usr/bin/env bash
   set -e
   cd "$(dirname "$0")"

   python3 -m venv django/env
   source django/env/bin/activate
   pip install -r django/requirements.txt
   deactivate

   cd app
   npm install --force
   ```
