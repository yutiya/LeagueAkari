import cp from 'child_process'
import { randomUUID } from 'crypto'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

/**
 * 来自 Riot 的证书文件
 * 可能会更新？但不是现在
 */
export const certificate = `-----BEGIN CERTIFICATE-----
MIIEIDCCAwgCCQDJC+QAdVx4UDANBgkqhkiG9w0BAQUFADCB0TELMAkGA1UEBhMC
VVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFTATBgNVBAcTDFNhbnRhIE1vbmljYTET
MBEGA1UEChMKUmlvdCBHYW1lczEdMBsGA1UECxMUTG9MIEdhbWUgRW5naW5lZXJp
bmcxMzAxBgNVBAMTKkxvTCBHYW1lIEVuZ2luZWVyaW5nIENlcnRpZmljYXRlIEF1
dGhvcml0eTEtMCsGCSqGSIb3DQEJARYeZ2FtZXRlY2hub2xvZ2llc0ByaW90Z2Ft
ZXMuY29tMB4XDTEzMTIwNDAwNDgzOVoXDTQzMTEyNzAwNDgzOVowgdExCzAJBgNV
BAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRUwEwYDVQQHEwxTYW50YSBNb25p
Y2ExEzARBgNVBAoTClJpb3QgR2FtZXMxHTAbBgNVBAsTFExvTCBHYW1lIEVuZ2lu
ZWVyaW5nMTMwMQYDVQQDEypMb0wgR2FtZSBFbmdpbmVlcmluZyBDZXJ0aWZpY2F0
ZSBBdXRob3JpdHkxLTArBgkqhkiG9w0BCQEWHmdhbWV0ZWNobm9sb2dpZXNAcmlv
dGdhbWVzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKoJemF/
6PNG3GRJGbjzImTdOo1OJRDI7noRwJgDqkaJFkwv0X8aPUGbZSUzUO23cQcCgpYj
21ygzKu5dtCN2EcQVVpNtyPuM2V4eEGr1woodzALtufL3Nlyh6g5jKKuDIfeUBHv
JNyQf2h3Uha16lnrXmz9o9wsX/jf+jUAljBJqsMeACOpXfuZy+YKUCxSPOZaYTLC
y+0GQfiT431pJHBQlrXAUwzOmaJPQ7M6mLfsnpHibSkxUfMfHROaYCZ/sbWKl3lr
ZA9DbwaKKfS1Iw0ucAeDudyuqb4JntGU/W0aboKA0c3YB02mxAM4oDnqseuKV/CX
8SQAiaXnYotuNXMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAf3KPmddqEqqC8iLs
lcd0euC4F5+USp9YsrZ3WuOzHqVxTtX3hR1scdlDXNvrsebQZUqwGdZGMS16ln3k
WObw7BbhU89tDNCN7Lt/IjT4MGRYRE+TmRc5EeIXxHkQ78bQqbmAI3GsW+7kJsoO
q3DdeE+M+BUJrhWorsAQCgUyZO166SAtKXKLIcxa+ddC49NvMQPJyzm3V+2b1roP
SvD2WV8gRYUnGmy/N0+u6ANq5EsbhZ548zZc+BI4upsWChTLyxt2RxR7+uGlS1+5
EcGfKZ+g024k/J32XP4hdho7WYAS2xMiV83CfLR/MNi8oSMaVQTdKD8cpgiWJk3L
XWehWA==
-----END CERTIFICATE-----`

export interface LcuAuth {
  port: number
  pid: number
  password: string
  certificate: string
}

export function isLcuAuthObject(obj: any): obj is LcuAuth {
  return (
    typeof obj === 'object' &&
    typeof obj.port === 'number' &&
    typeof obj.pid === 'number' &&
    typeof obj.password === 'string'
  )
}

const portRegex = /--app-port=([0-9]+)/
const passwordRegex = /--remoting-auth-token=([\w-_]+)/
const pidRegex = /--app-pid=([0-9]+)/
const clientName = 'LeagueClientUx.exe'

// 仅限 Windows 平台，因为需要 Powershell
export function queryLcuAuth(): Promise<LcuAuth> {
  return new Promise(function (resolve, reject) {
    try {
      const savePath = path.join(app.getPath('temp'), randomUUID())
      const cmd =
        `
      $_ = Start-Process powershell ` +
        `-Argumentlist "\`$PSDefaultParameterValues['Out-File:Encoding']='utf8';` +
        `Get-CimInstance -Query 'SELECT * from Win32_Process WHERE name LIKE ''${clientName}''' | ` +
        `Select-Object CommandLine | fl > ${savePath}" ` +
        `-WindowStyle hidden -Verb runas -Wait -PassThru`
      cp.exec(cmd, { shell: 'powershell' }, () => {
        try {
          if (!fs.existsSync(savePath)) {
            throw new Error('file not exists')
          }
          const raw = fs.readFileSync(savePath, 'utf-8').replace(/\s/g, '')
          if (raw.trim().length === 0) {
            throw new Error('empty file')
          }

          const [, port] = raw.match(portRegex)!
          const [, password] = raw.match(passwordRegex)!
          const [, pid] = raw.match(pidRegex)!
          fs.rmSync(savePath)
          resolve({
            port: Number(port),
            pid: Number(pid),
            password,
            certificate
          })
        } catch (e) {
          reject(e)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}
