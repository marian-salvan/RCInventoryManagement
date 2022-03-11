import { ReportPackageModel } from "./reports.models";

export interface PackageModel extends ReportPackageModel {
    date: Date;
}