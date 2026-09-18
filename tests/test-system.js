const testSystem = async () => {
  try {
    console.log("Starting integration test...");

    // Step A: POST a reservation
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const futureDate = future.toISOString().slice(0, 10);
    const marker = "integration-test-" + Date.now();
    const postPayload = {
      tableId: 1,
      name: "Integration Tester",
      phone: "+47 99999999",
      date: futureDate,
      time: "18:00",
      guests: 2,
      additionalInfo: marker
    };

    console.log("Step A: POSTing reservation...");
    const postRes = await fetch('http://localhost:5001/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postPayload)
    });

    if (!postRes.ok) {
      console.error("POST failed:", await postRes.text());
      return;
    }
    const postData = await postRes.json();
    console.log("POST successful, ID:", postData.id);

    // Step B: GET all reservations
    console.log("Step B: GETting all reservations...");
    const getRes = await fetch('http://localhost:5001/reservations');

    if (!getRes.ok) {
      console.error("GET failed:", await getRes.text());
      return;
    }
    const getAllData = await getRes.json();

    // Step C: Search the results for the marker we inserted
    console.log("Step C: Searching results for marker...");
    const found = getAllData.find(r => r.additionalInfo === marker);

    // Step D: Log results
    if (found) {
      console.log("SUCCESS: Reservation was persisted and retrieved correctly.");
    } else {
      console.log("FAIL: Reservation was not found in GET response.");
    }

  } catch (error) {
    console.error("Test execution error:", error);
  }
};

testSystem();
