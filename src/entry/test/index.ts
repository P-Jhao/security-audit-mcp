import { auditPackage } from "../index";

auditPackage(
  `/Users/yuanjin/Desktop/my-site`,
  `/Users/yuanjin/Desktop/my-site.md`
).then(() => {
  console.log('本地工程审计完成');
});