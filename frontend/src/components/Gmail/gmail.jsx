import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGmailAuth from "../../components/hooks/useGmailAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faCalendarAlt,
  faFolderOpen,
  faTrash,
  faEnvelope,
  faTimes,
  faBars,
  faPen,
  faInbox,
  faStar,
  faClock,
  faPaperPlane,
  faFileAlt,
  faChevronDown,
  faSearch,
  faCog,
  faQuestionCircle,
  faTh,
  faUserCircle,
  faTag,
  faUsers,
  faUser,
  faInfoCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import ComposeEmail from "./ComposeEmail";
import Inbox from "./Inbox";
import CreateLabelForm from "./CreateLabelForm";
import LabelEmailForm from "./LabelEmailForm";
import ContentTop from "../ContentTop/ContentTop";
import { fetchCurrentUser } from "../../redux/authSlice";

const Gmail = () => {
  const dispatch = useDispatch();
  const { user: userDeatail } = useSelector((state) => state.auth);
  const {
    gmailisAuthenticated,
    signIn,
    signOut,
    userProfile,
    gmailAccessToken,
    fetchInboxMessages,
    labels,
    fetchLabels,
    createLabel,
    getMessageDetail,
    getMessagesBySender,
    applyLabelToMessage,
    handleRemoveLabel,
  } = useGmailAuth();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  //console.log("Token for profile:", gmailAccessToken);

  //console.log("gmailisAuthenticated", gmailisAuthenticated);
  useEffect(() => {
    if (gmailisAuthenticated && gmailAccessToken) {
      fetchLabels(gmailAccessToken);
    }
  }, [gmailisAuthenticated, gmailAccessToken]);

  const [showCompose, setShowCompose] = useState(false);
  const [activeView, setActiveView] = useState("INBOX"); // 📌 default open
  const [dropdownOpenGMail, setDropdownOpenGMail] = useState(false);

  // Same system labels list you have in sidebar
  const systemLabels = ["INBOX", "STARRED", "SNOOZED", "SENT", "DRAFT"];

  // Map of system label names to their IDs
  const labelIdMap = labels?.reduce((acc, label) => {
    if (systemLabels.includes(label.name)) {
      acc[label.name] = label.id;
    }
    return acc;
  }, {});

  const renderActiveView = () => {
    switch (activeView) {
      case labelIdMap.INBOX:
        return (
          <Inbox
            gmailAccessToken={gmailAccessToken}
            fetchInboxMessages={fetchInboxMessages}
            labelName={activeView}
            getMessageDetail={getMessageDetail}
          />
        );
      case labelIdMap.STARRED:
        return <div>⭐ Starred Mails coming soon</div>;
      case labelIdMap.SNOOZED:
        return <div>⏰ Snoozed Mails coming soon</div>;
      case labelIdMap.SENT:
        return   <Inbox
            gmailAccessToken={gmailAccessToken}
            fetchInboxMessages={fetchInboxMessages}
            labelName={activeView}
            getMessageDetail={getMessageDetail}
          />;
      case labelIdMap.DRAFT:
        return <div>📝 Draft Mails coming soon</div>;
      default:
        return (
          <Inbox
            gmailAccessToken={gmailAccessToken}
            fetchInboxMessages={fetchInboxMessages}
            labelName={activeView}
            getMessageDetail={getMessageDetail}
          />
        );
    }
  };

  const handleAssignLabelToEmail = async (email, labelId) => {
    try {
      const messages = await getMessagesBySender(gmailAccessToken, email);
      if (messages?.length === 0) {
        alert("No emails found from this sender.");
        return;
      }

      await Promise.all(
        messages?.map((msg) =>
          applyLabelToMessage(gmailAccessToken, msg?.id, labelId)
        )
      );

      alert(`Assigned label to ${messages?.length} messages from ${email}`);
    } catch (error) {
      console.error("Failed to assign label:", error);
      alert("Error assigning label. Check console.");
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [labelToDelete, setLabelToDelete] = useState(null);

  return (
    <div className="main-content">
      <ContentTop />
      <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-2 py-2 overflow-auto">
        {/* Uma Maam Code */}
        <div className="font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-3 border-b bg-[#f1f3f4] rounded-t-[5px]">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBars} className="text-black" />
              <img
                src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png"
                alt="Gmail"
                className="h-6"
              />
            </div>
            {/* Search Box */}
            {gmailisAuthenticated && (
              <div className="flex items-center bg-white px-4 py-2 rounded-[15px] w-1/2">
                <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
                <input
                  type="text"
                  placeholder="Search mail"
                  className="bg-transparent outline-none px-2 w-full text-sm text-black"
                />
              </div>
            )}

            {/* Right Icons */}
            {/* <div className="relative flex items-center gap-4"> */}

            {/* User Avatar */}
            {/* <div className="relative">
                <div
                  className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
                  onClick={() => setDropdownOpenGMail(!dropdownOpenGMail)}
                >
                  <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                </div>

                {dropdownOpenGMail && (
                  <div className="absolute right-0 mt-2 w-fit px-4 py-2 bg-white border rounded-md shadow-lg z-10">
                    <p className="font-semibold text-black">Prashant Mishra</p>
                    <p className="text-sm text-gray-600">
                      prashant@example.com
                    </p>
                  </div>
                )}
              </div> */}
            {/* </div> */}
          </div>
          <div className="flex h-[530px] font-sans">
            {/* Sidebar */}
            {gmailisAuthenticated && (
              <aside className="w-52 bg-[#f1f3f4] border-r border-gray-300 p-4 space-y-3 rounded-bl-[5px]">
                <button
                  onClick={() => setShowCompose(true)}
                  className="flex items-center gap-2 bg-blue-100 text-black px-3 py-2 rounded-[10px] mb-4 hover:bg-blue-200"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="" />
                  Compose
                </button>

                <div className="space-y-3">
                  <MenuItem
                    icon={faInbox}
                    label="Inbox"
                    labelId={labels?.find((l) => l.name === "INBOX")?.id}
                    activeView={activeView}
                    setActiveView={setActiveView}
                  />
                  <MenuItem
                    icon={faStar}
                    label="Starred"
                    labelId={labels?.find((l) => l.name === "STARRED")?.id}
                    activeView={activeView}
                    setActiveView={setActiveView}
                  />
                  <MenuItem
                    icon={faPaperPlane}
                    label="Sent"
                    labelId={labels?.find((l) => l.name === "SENT")?.id}
                    activeView={activeView}
                    setActiveView={setActiveView}
                  />

                  <div className="pt-4 border-t border-gray-300">
                    <CreateLabelForm
                      createLabel={createLabel}
                      labels={labels}
                    />
                    {/* <h4 className="text-gray-600 text-xs uppercase mb-2">
                      Labels
                    </h4> */}
                    {labels
                      .filter(
                        (label) =>
                          ![
                            "INBOX",
                            "STARRED",
                            "SNOOZED",
                            "SENT",
                            "DRAFT",
                            "TRASH",
                            "IMPORTANT",
                            "CATEGORY_PERSONAL",
                            "CATEGORY_SOCIAL",
                            "CATEGORY_PROMOTIONS",
                            "CATEGORY_UPDATES",
                            "CATEGORY_FORUMS",
                            "SPAM",
                            "CHAT",
                            "UNREAD",
                          ].includes(label.name)
                      )
                      .map((label) => (
                        // <MenuItem
                        //   key={label.id}
                        //   icon={faFolderOpen}
                        //   label={label.name}
                        //   labelId={label.id}
                        //   activeView={activeView}
                        //   setActiveView={setActiveView}
                        //   onRemoveLabel={() => handleRemoveLabel(label.id)}
                        // />
                        <div
                          key={label.id}
                          className="flex mt-4 items-center justify-between p-2 bg-gray-300 hover:bg-gray-300 rounded cursor-pointer"
                          onClick={() => {
                            setActiveView(label.id);
                          }}
                        >
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faFolderOpen}
                              className="mr-2 text-gray-600"
                            />
                            <span className="text-gray-800 text-[14px]">{label.name}</span>
                          </div>
                          <FontAwesomeIcon
                            icon={faTimes}
                            onClick={(e) => {
                              e.stopPropagation(); // prevents triggering the parent div's onClick
                              setLabelToDelete(label);
                              setShowConfirm(true);
                            }}
                            className="text-red-500 cursor-pointer hover:text-red-600"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </aside>
            )}

            {showConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
                  <h2 className="text-lg font-semibold mb-4 text-black">Remove label</h2>
                  <p className="mb-6 text-black">
                    Delete the label{" "}
                    <span className="font-medium">"{labelToDelete.name}"</span>?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="bg-gray-500 text-gray-100 hover:text-gray-200 px-3 rounded-[5px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleRemoveLabel(labelToDelete.id,gmailAccessToken);
                        setShowConfirm(false);
                      }}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto bg-gray-200 rounded-br-[5px] rounded-bl-[5px]">
              {gmailisAuthenticated ? (
                <>
                  {/* User Topbar */}
                  <div className="flex items-center md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px]  mb-6">
                    <div className="flex items-center space-x-1">
                      <img
                        src={userProfile?.picture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border border-gray-400 p-[2px]"
                      />
                      <div>
                        <h3 className="text-[15px] font-semibold text-black">
                          {userProfile?.name}
                        </h3>
                        <p className="-mt-1 text-gray-600 text-[13px] ">
                          {userProfile?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={signOut}
                      className="flex items-center border border-gray-800 gap-2  text-black px-3 py-2 rounded-[10px] mb-4 hover:bg-bgDataNew hover:text-white hover:border-bgDataNew"
                      style={{ border: "1px solid gray" }}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                  </div>
                  <LabelEmailForm
                    labels={labels}
                    onAssignLabel={handleAssignLabelToEmail}
                  />

                  {/* Category Tabs */}
                  <div className="flex gap-4 mt-4 mb-2 text-sm">
                    <Tab text="Primary" active />
                    <Tab text="Promotions" badge="6 new" badgeColor="green" />
                    <Tab text="Social" badge="4 new" badgeColor="blue" />
                    <Tab text="Updates" badge="26 new" badgeColor="orange" />
                  </div>
                  {/* Render active view */}
                  {renderActiveView()}
                </>
              ) : (
                <div className="text-center mt-32">
                  <h2 className="text-2xl font-bold mb-3 text-gray-600">
                    📧 Gmail Integration
                  </h2>
                  <p className="mt-0 mb-6 text-bgDataNew font-poppins border-none w-fit px-4 py-2 bg-[#473b33] rounded-[5px] font-medium text-[15px] text-bgData mb-0 text-center mx-auto">
                    ** Your Can SignIn With this Email {userDeatail?.email} **
                  </p>
                  <button
                    onClick={signIn}
                    className="px-4 py-2 bg-bgDataNew text-white rounded-lg text-lg hover:bg-[#fe6c00d1] transition"
                  >
                    Login with Gmail
                  </button>
                </div>
              )}
            </main>

            {/* Compose Email Modal */}
            {showCompose && (
              <ComposeEmail
                gmailAccessToken={gmailAccessToken}
                onClose={() => setShowCompose(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, labelId, activeView, setActiveView }) => (
  <div
    onClick={() => setActiveView(labelId)}
    className={`flex items-center space-x-3 text-gray-700 hover:bg-gray-200 p-2 rounded-lg cursor-pointer transition ${
      activeView === labelId ? "bg-blue-100 font-semibold" : ""
    }`}
  >
    <FontAwesomeIcon icon={icon} className="w-4 h-4" />
    <span className="text-sm">{label}</span>
  </div>
);

const Tab = ({ text, active, badge, badgeColor }) => {
  const badgeStyles = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
  };
  return (
    <div
      className={`flex items-center gap-2 border-b-2 px-2 py-1 cursor-pointer ${
        active ? "border-blue-600 font-semibold" : "border-transparent"
      }`}
    >
      <span className="text-black">{text}</span>
      {badge && (
        <span
          className={`text-black text-xs px-2 rounded-full ${badgeStyles[badgeColor]}`}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export default Gmail;
