# Run AIX Next locally

Clone AIX Next into a directory that is not inside another Node project.

Recommended:

```bash
cd ~/Downloads
git clone https://github.com/salve-de/AIX-next.git
cd AIX-next
npm install
cp .env.example .env.local
npm run dev
```

Then open:

```text
http://localhost:3000
```

Verify you are running AIX Next, not a parent project:

```bash
pwd
node -p "require('./package.json').name"
git remote -v
```

Expected package name:

```text
aix-next
```

If `npm run dev` prints another package name, stop and confirm that your current directory contains AIX Next's own `package.json`.
