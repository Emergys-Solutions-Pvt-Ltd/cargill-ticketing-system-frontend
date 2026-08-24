// Mock ticket data — swap back to apiService when backend ready
const statuses = ["OPEN", "CLOSED", "PENDING", "IN PROGRESS"];
const staff = ["Eddy", "Maria", "Sam", "Priya", "Unassigned"];
const types = ["Service", "Incident", "Task"];

const allTickets = Array.from({ length: 100 }, (_, i) => ({
  ticketid: `TCK-${1000 + i}`,
  ticketshortdesc: `Sample ticket short description ${i + 1}`,
  ticketdesc: `How can HR help you?: Sample full description for ticket ${i + 1}. Lorem ipsum dolor sit amet.`,
  tickettype: types[i % types.length],
  ticketstatus: statuses[i % statuses.length],
  staffname: staff[i % staff.length],
  formname: "General Request",
  clientid: `CL-${200 + (i % 10)}`,
  contact: `contact${i % 10}@example.com`,
  created: new Date(2025, 0, 1 + i).toISOString().slice(0, 10),
}));

export default allTickets;
