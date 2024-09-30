import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../db/firebaseConfig";
import "./todoList.css";

const TodoForm = () => {
	// Estado para almacenar el valor del input de tarea
	const [tarea, setTarea] = useState("");
	// Estado para almacenar la fecha límite de la tarea
	const [fecha, setFecha] = useState("");
	// Estado para almacenar la prioridad de la tarea
	const [prioridad, setPrioridad] = useState("");

	// Función para manejar el envío del formulario
	const handleSubmit = async (e) => {
		e.preventDefault(); // Previene el comportamiento por defecto del formulario

		if (!tarea || !fecha) {
			// Verifica que los campos de tarea y fecha no estén vacíos
			alert("Por favor, completa todos los campos.");
			return;
		}

		try {
			// Referencia a la ubicación en Firebase donde se guardarán las tareas
			const tareasRef = ref(database, "tareas");

			// Añade una nueva tarea a la base de datos con los valores del formulario
			await push(tareasRef, {
				tarea,
				fecha,
				prioridad,
				completada: false,
			});

			// Limpia los campos del formulario después de enviar
			setTarea("");
			setFecha("");
			setPrioridad("");
		} catch (error) {
			console.error("Error al añadir la tarea:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="display-form">
			{/* Campo para ingresar la tarea */}
			<div>
				<textarea
					name=""
					className="texto-tarea"
					type="text"
					id="tarea"
					value={tarea}
					placeholder="Escriba aqui su tarea"
					onChange={(e) => setTarea(e.target.value)}
				></textarea>
			</div>

			{/* Campo para seleccionar la fecha límite */}
			<div>
				<label htmlFor="fecha">Fecha límite:</label>
				<br />
				<input
					type="date"
					id="fecha"
					value={fecha}
					onChange={(e) => setFecha(e.target.value)}
				/>
			</div>

			{/* Campo para seleccionar la prioridad */}
			<div>
				<label htmlFor="prioridad">Prioridad:</label>
				<br />
				<select
					id="prioridad"
					value={prioridad}
					onChange={(e) => setPrioridad(e.target.value)}
				>
					<option value="">Selecciona una prioridad</option>
					<option value="Alta">Alta</option>
					<option value="Media">Media</option>
					<option value="Baja">Baja</option>
				</select>
			</div>

			{/* Botón para enviar el formulario */}
			<button type="submit" className="btn btn-success">
				Añadir Tarea
			</button>
		</form>
	);
};

export default TodoForm;
