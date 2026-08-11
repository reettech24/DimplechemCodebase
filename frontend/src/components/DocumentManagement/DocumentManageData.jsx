import React,{useState} from "react";
import { iconsImgs } from "../../utils/images";
import DocumentAddUserModal from "./DocumentAddUserModal";
import DocumentShow from "./DocumentShow";
import "./DocumentManageData.css";

const DocumentManageData = () => {
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [templates] = useState([
      { id: 1, name: "Invoice Template", style: "bg-gray-300" },
      { id: 2, name: "Report Template", style: "bg-gray-300" },
      { id: 3, name: "Proposal Template", style: "bg-gray-300" },
      { id: 4, name: "Agreement Template", style: "bg-gray-300" },
    ]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [uploadedContent, setUploadedContent] = useState(null);
    const [activeButton, setActiveButton] = useState("Invoice");

    const toggleSection = (buttonName) => {
      setActiveButton(buttonName);
    };
  
  
    console.log("file",file);
    console.log("uploadedContent", uploadedContent)
  
  
    //---------------- Handle File Upload -----------------//
    const handleFileUpload = (event) => {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
  
      // Simulate extracting data from the file (for demo purposes)
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setUploadedContent(content);
      };
      // Replace with actual file parsing logic
      reader.readAsText(uploadedFile); 
    };


    //----------------------- Save the Document File -----------------------//
    const handleSaveData = () => {
      if (!title || !selectedTemplate || !file || !uploadedContent) {
        alert("Please fill in all fields and upload a file.");
        return;
      }
  
      const dataToSave = {
        title,
        template: selectedTemplate,
        fileName: file.name,
        content: uploadedContent,
      };
  
      // Save to localStorage
      localStorage.setItem("documentData", JSON.stringify(dataToSave));
      alert("Data saved successfully!");
      setAddUserModalOpen(false);
    };



  return (
    <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div>
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Document Management
            </h1>
          </div>
          <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
            <div>
              {/* <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
              /> */}
            </div>
            <div>
              <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                onClick={() => setAddUserModalOpen(true)}
              >
                <img
                  src={iconsImgs.plus}
                  alt="plus icon"
                  className="w-[18px] mr-1"
                />{" "}
                Add New Document
              </button>
            </div>
          </div>
        </div>
        <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
          {/*------- Show the Document -------*/}
          <DocumentShow
            toggleSection={toggleSection}
            setActiveButton={setActiveButton}
            activeButton={activeButton}
          />
          {/*------- Show the Document -------*/}
        </div>
        <div className="flex justify-between">
          {/* Pagination Controls with Number */}
          {/* <PaginationCR
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          /> */}
        </div>
      </div>

       {/* Add User Modal */}
      {isAddUserModalOpen && (
        <DocumentAddUserModal
          setAddUserModalOpen={setAddUserModalOpen}
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          setTitle={setTitle}
          title={title}
          handleFileUpload={handleFileUpload}
          handleSaveData={handleSaveData}
        />
      )}

    </div>
  );
};

export default DocumentManageData;