diff --git a/README.md b/README.md
index 4a71927ea7073da4ba75af65c4cd962c83870feb..d7b52b5e48eb5362db1dbd2c7d3a8dcbb3cf3d53 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,26 @@
-# https-github.com-mustardir-qfx-finance
\ No newline at end of file
+# QFX Finance (deployment notes)
+
+## Docker Compose warning: `version` is obsolete
+
+If `docker compose` prints:
+
+- `the attribute 'version' is obsolete, it will be ignored`
+
+remove the top-level `version:` key from `docker-compose.yml`. Compose v2 ignores it and warns on every command.
+
+## If `qfx_client` keeps restarting
+
+Run targeted logs first:
+
+```bash
+docker compose logs --tail=200 client
+docker compose logs --tail=200 api
+```
+
+Then check the final exit code/reason:
+
+```bash
+docker inspect qfx_client --format '{{.State.Status}} {{.State.ExitCode}} {{.State.Error}}'
+```
+
+Common causes are missing runtime environment variables, API URL mismatch, or startup command failure in the client image.

