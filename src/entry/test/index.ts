import { auditPackage } from "../index";

// auditPackage(
//   `C:/Users/22126/Desktop/AHcompany/dstaff-front`,
//   `C:/Users/22126/Desktop/dstaff-front.md`
// ).then(() => {
//   console.log("本地工程审计完成");
// });

// auditPackage(
//   `https://github.com/webpack/webpack-dev-server/tree/v4.9.3`,
//   `C:/Users/22126/Desktop/webpack-dev-server_4_9_3.md`
// ).then(() => {
//   console.log("远程工程审计完成");
// });

auditPackage(
  `https://github.com/P-Jhao/agentForge-frontend/tree/main`,
  `C:/Users/22126/Desktop/agentForge-frontend.md`
).then(() => {
  console.log("远程工程审计完成");
});
