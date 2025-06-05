import React from "react";
import TestDriveList from "./_components/test-drive-list";

const TestDrivePage = () => {
  return (
    <div className="p-6">
      <h1>Test Drive Management</h1>
      <div className="mt-2">
        <TestDriveList />
      </div>
    </div>
  );
};

export default TestDrivePage;
