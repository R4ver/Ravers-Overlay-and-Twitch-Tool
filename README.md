# R4VERS OVERLAY CHANGER
A small tool written in ReactJS together with ExpressJS to handle Twitch API interaction.

Provides a small installable service which runs the server and serves the React application to then be used in OBS or standalone in a browser.
There's also a Socket.io server setup to be used in overlays, as an example, to mimic a Mixer (rip) constellation like service since Twitch isn't providing what I need.

This entire thing is currently some hot garbo spaghetti code, but I just want the core things down and cleanup later cause I'm a PRO HTML programmer KEKW!

---
## Environment
```
TWITCH_CLIENT_ID=<YOUR TWITCH CLIENT ID>
TWITCH_CLIENT_SECRET=<YOUR TWITCH CLIENT SECRET>
PORT=<EXPRESS SERVER PORT>
```

# LICENSE
Copyright (c) 2020 R4ver <r4ver.com | @R4verLIVE>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.