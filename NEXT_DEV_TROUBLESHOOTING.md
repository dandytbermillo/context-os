# Next.js Development Server Troubleshooting Guide

## Problem: npm run dev Connection Issues

When running `npm run dev` for Next.js applications, you may encounter connection issues where the server appears to start but cannot be accessed via browser.

### Symptoms
- Server shows "Ready in X ms" message
- Browser displays "Unable to connect" or "Connection refused"
- `curl` tests return connection errors
- Process doesn't appear in `ps aux | grep next`

### Root Cause
The Next.js development server process is not persisting properly when run through certain command-line interfaces. The server starts but terminates immediately, preventing proper port binding.

## Solution: Background Process Execution

Use the following command to start the Next.js development server in a persistent background process:

```bash
nohup npm run dev > /dev/null 2>&1 & echo $!
```

### Command Breakdown

| Component | Purpose |
|-----------|---------|
| `nohup` | Prevents process termination when terminal session ends |
| `npm run dev` | The actual Next.js development command |
| `> /dev/null 2>&1` | Redirects stdout and stderr to prevent output clutter |
| `&` | Runs the process in the background |
| `echo $!` | Displays the Process ID (PID) for reference |

### Verification Steps

1. **Start the server:**
   ```bash
   nohup npm run dev > /dev/null 2>&1 & echo $!
   ```

2. **Wait a few seconds** for the server to initialize

3. **Test the connection:**
   ```bash
   curl -s http://localhost:3000 | head -5
   ```

4. **Expected result:** HTML content should be returned, indicating successful connection

5. **Browser test:** Navigate to `http://localhost:3000` in your browser

## Alternative Solutions

### Option 1: Different Port
If port 3000 is problematic, try a different port:
```bash
nohup npx next dev -p 3001 > /dev/null 2>&1 & echo $!
```

### Option 2: Bind to All Interfaces
For network access issues, bind to all interfaces:
```bash
nohup npx next dev -H 0.0.0.0 -p 3000 > /dev/null 2>&1 & echo $!
```

## Process Management

### Finding the Process
```bash
ps aux | grep next
```

### Stopping the Server
```bash
pkill -f "next dev"
```

Or using the PID from the initial command:
```bash
kill [PID]
```

### Checking Port Usage
```bash
lsof -i :3000
```

## Common Issues and Solutions

### Issue: Permission Errors
**Solution:** Fix npm cache permissions:
```bash
sudo chown -R $(id -u):$(id -g) ~/.npm
```

### Issue: Port Already in Use
**Solution:** Kill existing processes:
```bash
pkill -f "next dev"
# or
lsof -ti:3000 | xargs kill
```

### Issue: Node Modules Issues
**Solution:** Clean install:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Best Practices

1. **Always verify** the server is running before accessing in browser
2. **Use curl** to test connectivity before browser testing
3. **Note the PID** returned by the background command for easy process management
4. **Check logs** if issues persist by removing `> /dev/null 2>&1` temporarily

## Environment-Specific Notes

### macOS
- May require allowing localhost connections in firewall settings
- Some corporate networks block localhost access

### Linux
- Check if systemd or other process managers are interfering
- Verify user permissions for port binding

### Windows (WSL)
- Ensure Windows firewall allows WSL connections
- May need to access via Windows host IP instead of localhost

## Debugging Commands

```bash
# Check if port is listening
netstat -an | grep LISTEN | grep 3000

# Check process details
ps aux | grep next

# Test different localhost variations
curl http://localhost:3000
curl http://127.0.0.1:3000
curl http://0.0.0.0:3000

# Check Node.js version compatibility
node --version
npm --version
```

## When to Use This Solution

- ✅ Development environments with command-line interfaces
- ✅ Automated deployment scripts
- ✅ Docker containers
- ✅ CI/CD pipelines
- ✅ Remote development servers

## When NOT to Use This Solution

- ❌ Production deployments (use `npm run build` + `npm start`)
- ❌ Local development with IDE integration
- ❌ When you need real-time output monitoring

---

**Last Updated:** 2025-06-26  
**Next.js Version:** 14.0.0  
**Node.js Version:** 22.17.0