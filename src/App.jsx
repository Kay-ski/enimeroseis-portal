import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  MessageSquare,
  Search,
  UserRound,
  ClipboardList,
  Home,
  CheckCircle2,
  Clock3,
  AlertCircle,
  LogOut,
  ShieldCheck,
  Users,
  Building2,
  Upload,
  Bell,
  FileText,
  X,
  RotateCcw,
  Save,
} from "lucide-react";

function Card({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const roles = [
  { id: "admin", label: "Admin", description: "Add properties, updates, tasks, photos, and manage clients." },
  { id: "client", label: "Client", description: "View property updates, photos, and reply to the team." },
  { id: "team", label: "Construction Team", description: "View assigned work, update task status, and upload completion notes." },
];

const properties = [
  { id: 1, name: "NEVIS PEAK", client: "MR. TOMMY", status: "Active", address: "NEVIS" },
  { id: 2, name: "LOT 127", client: "MISTER BOB", status: "Active", address: "NEVIS" },
  { id: 3, name: "Lot 133", client: "MISS JANE DOE", status: "Maintenance", address: "NEVIS" },
];

const teamMembers = ["MARVIN", "JAMES", "YOGI", "LONGMAN", "Kamal"];

const initialUpdates = [
  {
    id: 1,
    propertyId: 1,
    title: "Owner closet trim options",
    message: "Two trim solutions are ready to show for the ceiling area. Door trim materials were picked up Friday.",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop"],
    status: "Needs Client Review",
    assignedTo: "Marvin",
    createdBy: "Kamal",
    date: "Today",
    replies: [
      { author: "Client", message: "Please show both options before starting the ceiling trim.", photo: "" },
    ],
  },
  {
    id: 2,
    propertyId: 2,
    title: "Pool water level check",
    message: "Pool level was inspected and topped up. Photos added for owner visibility.",
    photos: ["https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=900&auto=format&fit=crop"],
    status: "Completed",
    assignedTo: "Bernard",
    createdBy: "Kamal",
    date: "Yesterday",
    replies: [],
  },
  {
    id: 3,
    propertyId: 3,
    title: "Coral stone grout repair",
    message: "Terrace grout repair needs scheduling near BBQ area. Materials required before work starts.",
    photos: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop"],
    status: "Assigned",
    assignedTo: "Glyn",
    createdBy: "Kamal",
    date: "May 17",
    replies: [],
  },
];

const statusStyles = {
  Completed: "bg-green-100 text-green-700",
  Assigned: "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  "Needs Client Review": "bg-amber-100 text-amber-700",
  Pending: "bg-gray-100 text-gray-700",
};

function StatusIcon({ status }) {
  if (status === "Completed") return <CheckCircle2 className="h-4 w-4" />;
  if (status === "Needs Client Review") return <AlertCircle className="h-4 w-4" />;
  return <Clock3 className="h-4 w-4" />;
}

function PhotoEditor({ image, onCancel, onSave }) {
  const imageRef = useRef(null);
  const [circles, setCircles] = useState([]);
  const [start, setStart] = useState(null);
  const [previewCircle, setPreviewCircle] = useState(null);

  const getPoint = (event) => {
    const rect = imageRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const handleMouseDown = (event) => {
    const point = getPoint(event);
    setStart(point);
    setPreviewCircle({ x: point.x, y: point.y, r: 1 });
  };

  const handleMouseMove = (event) => {
    if (!start) return;
    const point = getPoint(event);
    const dx = point.x - start.x;
    const dy = point.y - start.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    setPreviewCircle({ x: start.x, y: start.y, r });
  };

  const handleMouseUp = () => {
    if (previewCircle && previewCircle.r > 8) {
      setCircles([...circles, previewCircle]);
    }
    setStart(null);
    setPreviewCircle(null);
  };

  const saveMarkedPhoto = () => {
    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / img.getBoundingClientRect().width;
    const scaleY = canvas.height / img.getBoundingClientRect().height;

    ctx.strokeStyle = "red";
    ctx.lineWidth = Math.max(8, canvas.width * 0.008);
    circles.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x * scaleX, circle.y * scaleY, circle.r * scaleX, 0, Math.PI * 2);
      ctx.stroke();
    });

    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">Mark up photo</h3>
            <p className="text-sm text-slate-500">Click and drag on the photo to circle the area you want to point out.</p>
          </div>
          <button onClick={onCancel} className="rounded-full bg-slate-100 p-2 hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="relative max-h-[65vh] overflow-hidden rounded-2xl bg-slate-100"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img ref={imageRef} src={image} alt="Editor preview" className="max-h-[65vh] w-full select-none object-contain" draggable="false" />
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {circles.map((circle, index) => (
              <circle key={index} cx={circle.x} cy={circle.y} r={circle.r} fill="none" stroke="red" strokeWidth="4" />
            ))}
            {previewCircle && <circle cx={previewCircle.x} cy={previewCircle.y} r={previewCircle.r} fill="none" stroke="red" strokeWidth="4" strokeDasharray="8 6" />}
          </svg>
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-3">
          <button onClick={() => setCircles([])} className="inline-flex items-center rounded-2xl bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200">
            <RotateCcw className="mr-2 h-4 w-4" /> Clear marks
          </button>
          <Button onClick={saveMarkedPhoto}>
            <Save className="mr-2 h-4 w-4" /> Save marked photo
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
            <ShieldCheck className="h-4 w-4" /> Secure property client portal
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Property updates clients can actually follow.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Upload progress photos, send updates, collect client replies, assign work to your construction team, and keep every property organized in one place.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-4">
              <Building2 className="mb-3 h-6 w-6" />
              <div className="font-semibold">Properties</div>
              <div className="text-sm text-slate-300">Organized by villa or lot</div>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <Camera className="mb-3 h-6 w-6" />
              <div className="font-semibold">Photos</div>
              <div className="text-sm text-slate-300">Before, during, after</div>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <Users className="mb-3 h-6 w-6" />
              <div className="font-semibold">Team</div>
              <div className="text-sm text-slate-300">Assign and track work</div>
            </div>
          </div>
        </motion.div>

        <Card className="rounded-[2rem] border-0 bg-white text-slate-900 shadow-2xl">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl font-bold">Demo Login</h2>
            <p className="mt-2 text-slate-500">Choose a role to preview how the portal will work.</p>
            <div className="mt-6 space-y-3">
              {roles.map((role) => (
                <button key={role.id} onClick={() => onLogin(role.id)} className="w-full rounded-3xl border border-slate-200 p-4 text-left transition hover:border-slate-900 hover:bg-slate-50">
                  <div className="font-bold">{role.label}</div>
                  <div className="text-sm text-slate-500">{role.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ClientPropertyPortalWebApp() {
  const [role, setRole] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(1);
  const [updates, setUpdates] = useState(initialUpdates);
  const [search, setSearch] = useState("");
  const [newUpdate, setNewUpdate] = useState({ title: "", message: "", assignedTo: "Marvin", status: "Assigned", photo: "" });
  const [replyText, setReplyText] = useState({});
  const [replyPhotos, setReplyPhotos] = useState({});
  const [editor, setEditor] = useState(null);
  const [clients, setClients] = useState([
    { id: 1, firstName: "Tommy", lastName: "Owner", phone: "+1 869 000 0000", email: "tommy@example.com", username: "tommy", propertyId: 1 },
    { id: 2, firstName: "Bob", lastName: "Owner", phone: "+1 869 000 0001", email: "bob@example.com", username: "bob", propertyId: 2 },
  ]);
  const [newClient, setNewClient] = useState({ firstName: "", lastName: "", phone: "", email: "", username: "", propertyId: 1 });

  const activeProperty = properties.find((p) => p.id === selectedProperty);
  const canManage = role === "admin";
  const canReply = role === "client" || role === "admin" || role === "team";
  const canChangeStatus = role === "admin" || role === "team";
  const visibleProperties = role === "client" ? properties.filter((p) => p.id === 1) : properties;

  const filteredUpdates = useMemo(() => {
    return updates
      .filter((u) => u.propertyId === selectedProperty)
      .filter((u) => `${u.title} ${u.message} ${u.assignedTo}`.toLowerCase().includes(search.toLowerCase()));
  }, [updates, selectedProperty, search]);

  const stats = useMemo(() => {
    const propertyUpdates = updates.filter((u) => u.propertyId === selectedProperty);
    return {
      total: propertyUpdates.length,
      completed: propertyUpdates.filter((u) => u.status === "Completed").length,
      review: propertyUpdates.filter((u) => u.status === "Needs Client Review").length,
      assigned: propertyUpdates.filter((u) => u.status === "Assigned" || u.status === "In Progress").length,
    };
  }, [updates, selectedProperty]);

  const handlePhotoUpload = (event, updateId = null) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const photoUrl = URL.createObjectURL(file);
    if (updateId) {
      setUpdates(updates.map((u) => (u.id === updateId ? { ...u, photos: [photoUrl] } : u)));
    } else {
      setNewUpdate({ ...newUpdate, photo: photoUrl });
    }
  };

  const handleReplyPhotoUpload = (event, updateId) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const photoUrl = URL.createObjectURL(file);
    setEditor({ updateId, image: photoUrl });
  };

  const saveEditedReplyPhoto = (markedPhoto) => {
    if (!editor) return;
    setReplyPhotos({ ...replyPhotos, [editor.updateId]: markedPhoto });
    setEditor(null);
  };

  const addUpdate = () => {
    if (!newUpdate.title.trim() || !newUpdate.message.trim()) return;
    setUpdates([
      {
        id: Date.now(),
        propertyId: selectedProperty,
        title: newUpdate.title,
        message: newUpdate.message,
        photos: [newUpdate.photo || "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=900&auto=format&fit=crop"],
        status: newUpdate.status,
        assignedTo: newUpdate.assignedTo,
        createdBy: "Kamal",
        date: "Just now",
        replies: [],
      },
      ...updates,
    ]);
    setNewUpdate({ title: "", message: "", assignedTo: "Marvin", status: "Assigned", photo: "" });
  };

  const addReply = (id) => {
    const text = replyText[id];
    const photo = replyPhotos[id] || "";
    if (!text?.trim() && !photo) return;
    setUpdates(updates.map((u) => (u.id === id ? { ...u, replies: [...u.replies, { author: role === "client" ? "Client" : role === "team" ? "Team" : "Admin", message: text || "Photo attached", photo }] } : u)));
    setReplyText({ ...replyText, [id]: "" });
    setReplyPhotos({ ...replyPhotos, [id]: "" });
  };

  const updateStatus = (id, status) => {
    setUpdates(updates.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  if (!role) return <LoginScreen onLogin={setRole} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {editor && <PhotoEditor image={editor.image} onCancel={() => setEditor(null)} onSave={saveEditedReplyPhoto} />}

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">ROYANA Property Portal</div>
            <div className="text-xl font-bold">Client Updates & Construction Tasks</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold md:inline-flex">Logged in as {roles.find((r) => r.id === role)?.label}</span>
            <Button onClick={() => setRole(null)} className="rounded-2xl">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="rounded-3xl border-0 bg-white shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Total Updates</div><div className="mt-2 text-3xl font-bold">{stats.total}</div></CardContent></Card>
          <Card className="rounded-3xl border-0 bg-white shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Completed</div><div className="mt-2 text-3xl font-bold">{stats.completed}</div></CardContent></Card>
          <Card className="rounded-3xl border-0 bg-white shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Client Review</div><div className="mt-2 text-3xl font-bold">{stats.review}</div></CardContent></Card>
          <Card className="rounded-3xl border-0 bg-white shadow-sm"><CardContent className="p-5"><div className="text-sm text-slate-500">Assigned / Active</div><div className="mt-2 text-3xl font-bold">{stats.assigned}</div></CardContent></Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-[290px_1fr]">
          <aside className="space-y-4">
            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2 font-semibold"><Home className="h-5 w-5" /> Properties</div>
                <div className="space-y-2">
                  {visibleProperties.map((property) => (
                    <button key={property.id} onClick={() => setSelectedProperty(property.id)} className={`w-full rounded-2xl p-3 text-left transition ${selectedProperty === property.id ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-100"}`}>
                      <div className="font-semibold">{property.name}</div>
                      <div className={`text-sm ${selectedProperty === property.id ? "text-slate-200" : "text-slate-500"}`}>{property.client}</div>
                      <div className={`text-xs ${selectedProperty === property.id ? "text-slate-300" : "text-slate-400"}`}>{property.address}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2 font-semibold"><ClipboardList className="h-5 w-5" /> What this app does</div>
                <div className="space-y-3 text-sm text-slate-600">
                  <p><strong>Client:</strong> sees property updates, replies, and can upload marked photos.</p>
                  <p><strong>Admin:</strong> adds updates, photos, assignments, and reports.</p>
                  <p><strong>Team:</strong> sees assigned work and updates progress.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2 font-semibold"><Bell className="h-5 w-5" /> Future Features</div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>Email notifications</p>
                  <p>WhatsApp-style update alerts</p>
                  <p>PDF monthly reports</p>
                  <p>Invoice and document area</p>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="space-y-5">
            {canManage && (
              <Card className="rounded-3xl border-0 bg-white shadow-sm">
                <CardContent className="p-5">
                  <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Create New Client</h3>
                      <p className="text-sm text-slate-500">Add client details and connect the client to a property.</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Admin only</span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <input value={newClient.firstName} onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })} placeholder="First name" className="rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
                    <input value={newClient.lastName} onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })} placeholder="Last name" className="rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
                    <input value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} placeholder="Phone number" className="rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
                    <input value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} placeholder="Email address" className="rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
                    <input value={newClient.username} onChange={(e) => setNewClient({ ...newClient, username: e.target.value })} placeholder="Login username" className="rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
                    <select value={newClient.propertyId} onChange={(e) => setNewClient({ ...newClient, propertyId: Number(e.target.value) })} className="rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300">
                      {properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
                    </select>
                    <Button
                      className="md:col-span-3"
                      onClick={() => {
                        if (!newClient.firstName || !newClient.lastName || !newClient.username) return;
                        setClients([...clients, { id: Date.now(), ...newClient }]);
                        setNewClient({ firstName: "", lastName: "", phone: "", email: "", username: "", propertyId: 1 });
                      }}
                    >
                      <Users className="mr-2 h-5 w-5" /> Create Client
                    </Button>
                  </div>

                  {clients.length > 0 && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
                      <div className="grid grid-cols-5 bg-slate-100 px-3 py-2 text-xs font-bold uppercase text-slate-500">
                        <div>Name</div><div>Phone</div><div>Email</div><div>Username</div><div>Property</div>
                      </div>
                      {clients.map((client) => (
                        <div key={client.id} className="grid grid-cols-5 gap-2 border-t border-slate-100 px-3 py-3 text-sm text-slate-700">
                          <div>{client.firstName} {client.lastName}</div>
                          <div>{client.phone}</div>
                          <div className="truncate">{client.email}</div>
                          <div>{client.username}</div>
                          <div>{properties.find((p) => p.id === Number(client.propertyId))?.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{activeProperty?.name}</h2>
                    <p className="text-slate-500">Client: {activeProperty?.client} · {activeProperty?.address}</p>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search updates or team..." className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 outline-none focus:ring-2 focus:ring-slate-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {canManage && (
              <Card className="rounded-3xl border-0 bg-white shadow-sm">
                <CardContent className="p-5">
                  <h3 className="mb-4 text-lg font-bold">Add property update / assign work</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input value={newUpdate.title} onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })} placeholder="Update title" className="rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
                    <select value={newUpdate.assignedTo} onChange={(e) => setNewUpdate({ ...newUpdate, assignedTo: e.target.value })} className="rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300">
                      {teamMembers.map((member) => <option key={member}>{member}</option>)}
                    </select>
                    <textarea value={newUpdate.message} onChange={(e) => setNewUpdate({ ...newUpdate, message: e.target.value })} placeholder="Write update details..." className="min-h-24 rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300 md:col-span-2" />
                    <select value={newUpdate.status} onChange={(e) => setNewUpdate({ ...newUpdate, status: e.target.value })} className="rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300">
                      <option>Assigned</option><option>In Progress</option><option>Needs Client Review</option><option>Completed</option><option>Pending</option>
                    </select>
                    <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                      <Camera className="mr-2 h-5 w-5" /> Upload Photo
                      <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e)} className="hidden" />
                    </label>
                    {newUpdate.photo && <div className="md:col-span-2"><p className="mb-2 text-sm font-semibold text-slate-500">Photo preview</p><img src={newUpdate.photo} alt="New update preview" className="h-56 w-full rounded-3xl object-cover" /></div>}
                    <Button onClick={addUpdate} className="rounded-2xl py-6 md:col-span-2"><Upload className="mr-2 h-5 w-5" /> Add Update</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <motion.div key={update.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-sm">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-[270px_1fr]">
                        <div className="relative">
                          <img src={update.photos[0]} alt="Property update" className="h-56 w-full object-cover md:h-full" />
                          {canManage && <label className="absolute bottom-3 left-3 cursor-pointer rounded-2xl bg-white/95 px-3 py-2 text-sm font-semibold text-slate-800 shadow hover:bg-white">Change Photo<input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, update.id)} className="hidden" /></label>}
                        </div>
                        <div className="p-5">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[update.status] || statusStyles.Pending}`}><StatusIcon status={update.status} /> {update.status}</span>
                            <span className="text-sm text-slate-500">{update.date}</span>
                          </div>
                          <h3 className="text-xl font-bold">{update.title}</h3>
                          <p className="mt-2 text-slate-600">{update.message}</p>
                          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1"><UserRound className="h-4 w-4" /> Assigned to {update.assignedTo}</span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1"><MessageSquare className="h-4 w-4" /> {update.replies.length} replies</span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1"><FileText className="h-4 w-4" /> Created by {update.createdBy}</span>
                          </div>

                          {canChangeStatus && <div className="mt-4 flex flex-wrap gap-2">{["Assigned", "In Progress", "Needs Client Review", "Completed"].map((status) => <button key={status} onClick={() => updateStatus(update.id, status)} className={`rounded-full px-3 py-1 text-sm font-semibold ${update.status === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{status}</button>)}</div>}

                          {update.replies.length > 0 && (
                            <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-3">
                              {update.replies.map((reply, index) => (
                                <div key={index} className="text-sm text-slate-700">
                                  <p><strong>{reply.author}:</strong> {reply.message}</p>
                                  {reply.photo && <img src={reply.photo} alt="Reply attachment" className="mt-2 max-h-72 rounded-2xl object-contain" />}
                                </div>
                              ))}
                            </div>
                          )}

                          {canReply && (
                            <div className="mt-4 space-y-3">
                              {replyPhotos[update.id] && <img src={replyPhotos[update.id]} alt="Reply preview" className="max-h-56 rounded-2xl object-contain" />}
                              <div className="flex flex-col gap-2 md:flex-row">
                                <input value={replyText[update.id] || ""} onChange={(e) => setReplyText({ ...replyText, [update.id]: e.target.value })} placeholder="Write a reply..." className="flex-1 rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
                                <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                  <Camera className="mr-2 h-5 w-5" /> Add photo
                                  <input type="file" accept="image/*" onChange={(e) => handleReplyPhotoUpload(e, update.id)} className="hidden" />
                                </label>
                                <Button onClick={() => addReply(update.id)} className="px-5">Reply</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
