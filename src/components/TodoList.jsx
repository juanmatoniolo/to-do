import React, { useState, useEffect } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { database } from "../db/firebaseConfig";
import TodoForm from "./TodoForm";
import TodoCard from "./TodoCard";
import {  diffDays } from "@formkit/tempo";
import "./todoList.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Importa Bootstrap

const TodoList = () => {
	const [list, setList] = useState([]);
	const [showModal, setShowModal] = useState(false); // Control del modal
	const [taskToDelete, setTaskToDelete] = useState(null); // Tarea seleccionada para eliminar

	const calculateTimeRemaining = (dueDate) => {
		const now = new Date();
		const deadline = new Date(dueDate);
		const daysDifference = diffDays(deadline, now);

		if (daysDifference < 0) {
			return "Tarea caducada";
		} else if (daysDifference === 0) {
			return "Próximo a vencer";
		} else if (daysDifference <= 1) {
			return "";
		} else {
			return `Faltan ${daysDifference} días para vencer`;
		}
	};

	useEffect(() => {
		const tareasRef = ref(database, "tareas");

		const unsubscribe = onValue(tareasRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const tareasArray = Object.entries(data).map(
					([key, value]) => ({
						id: key,
						tarea: value.tarea,
						fecha: value.fecha,
						prioridad: value.prioridad,
						completada: value.completada,
					})
				);
				setList(tareasArray);
			} else {
				setList([]);
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	// Función para abrir el modal de confirmación de eliminación
	const handleDeleteClick = (task) => {
		setTaskToDelete(task); // Guardar la tarea que se va a eliminar
		setShowModal(true); // Mostrar el modal
	};

	// Función para confirmar la eliminación de la tarea
	const confirmDelete = async () => {
		if (taskToDelete) {
			try {
				await remove(ref(database, `tareas/${taskToDelete.id}`));
				setShowModal(false); // Cerrar el modal después de eliminar
				setTaskToDelete(null); // Limpiar la tarea seleccionada
			} catch (error) {
				console.error("Error al eliminar la tarea:", error);
			}
		}
	};

	// Función para cerrar el modal sin eliminar
	const cancelDelete = () => {
		setShowModal(false);
		setTaskToDelete(null);
	};

	// Función para marcar como completada o incompleta
	const onMarkAsCompleted = async (task) => {
		const updatedTask = {
			...task,
			completada: !task.completada, // Cambiar el estado de completada
		};
		try {
			await update(ref(database, `tareas/${task.id}`), updatedTask);
		} catch (error) {
			console.error("Error al actualizar la tarea:", error);
		}
	};

	const sortedTasks = list.sort((a, b) => {
		// Detectar si las tareas están caducadas
		const isExpiredA = calculateTimeRemaining(a.fecha) === "Tarea caducada";
		const isExpiredB = calculateTimeRemaining(b.fecha) === "Tarea caducada";

		// Ordenar tareas caducadas y completadas al final
		if (a.completada || isExpiredA) return 1;
		if (b.completada || isExpiredB) return -1;

		// Ordenar por prioridad si no están completadas ni caducadas
		if (a.prioridad && !b.prioridad) return -1;
		if (!a.prioridad && b.prioridad) return 1;

		// Ordenar por fecha
		const dateA = new Date(a.fecha);
		const dateB = new Date(b.fecha);

		return dateA - dateB;
	});

	return (
		<div>
			<div className="container container-formulario">
				<TodoForm />
			</div>
			<div className="listadoDeTareas">
				{sortedTasks.map((task) => (
					<TodoCard
						key={task.id}
						task={task}
						onDelete={() => handleDeleteClick(task)} // Cambiar para abrir el modal
						onMarkAsCompleted={() => onMarkAsCompleted(task)} // Función para marcar como completada
						calculateTimeRemaining={calculateTimeRemaining}
					/>
				))}
			</div>

			{/* Modal para confirmar eliminación */}
			{showModal && (
				<div
					className="modal fade show"
					style={{
						display: "block",
						backgroundColor: "rgba(0,0,0,0.5)",
					}}
					tabIndex="-1"
				>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">
									Confirmar Eliminación
								</h5>
							</div>
							<div className="modal-body">
								<p>
									¿Estás seguro de que deseas eliminar la
									tarea <strong>{taskToDelete?.tarea}</strong>?
								</p>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={cancelDelete}
								>
									Cancelar
								</button>
								<button
									type="button"
									className="btn btn-danger"
									onClick={confirmDelete}
								>
									Eliminar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TodoList;
